import {
  Checkbox,
  Flex,
  Icon,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react'
import { useEffect, useMemo, useRef } from 'react'
import {
  ColumnInstance,
  Row,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
  UseTableColumnProps,
} from 'react-table'

// Custom components
import Card from 'components/card/Card'
import { MdCheckCircle, MdOutlineError, MdPending } from 'react-icons/md'
import { MigrationCheckTableStatus } from 'types/TableData'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import { useDashboardStore } from 'contexts/useDashboardStore'

const formSchema = object({
  range: string(),
})

interface FormValues {
  range: string
}

export enum MigrationsCheckTableRange {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export const columnsDataCheck = [
  {
    Header: 'NAME',
    accessor: 'name',
  },
  {
    Header: 'STATUS',
    accessor: 'status',
  },
  // {
  //   Header: "PROGRESS",
  //   accessor: "progress",
  // },
  {
    Header: 'TABLES',
    accessor: 'quantity',
  },
  {
    Header: 'DATE',
    accessor: 'date',
  },
]

export default function MigrationsCheckTable() {
  const isFetching = useRef(false)
  const {
    setTotalMigrations,
    setFailurePercentage,
    setSuccessPercentage,
    setMigrationsData,
    migrationsData,
  } = useDashboardStore()

  async function fetchActivities() {
    await axios
      .get(`/api/activities`)
      .then(function (response) {
        const activities = response.data ? response.data.activities : []
        const cleanData = (activities || []).map((entry) => {
          const migratedCollections = entry.payload?.migratedCollections || []
          const errors = migratedCollections.filter((entry) => !entry.success)
          return {
            name: [entry.payload?.mongoDbName, true],
            quantity: migratedCollections.length,
            errors: errors.map((error) => error.error),
            hasErrors: errors.length > 0,
            status:
              errors.length > 0
                ? MigrationCheckTableStatus.ERROR
                : MigrationCheckTableStatus.COMPLETED,
            date: new Date(entry.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              hour12: false,
              minute: '2-digit',
            }),
            progress: 100,
          }
        })

        refreshPieChart(cleanData)
        setMigrationsData(cleanData)
      })
      .catch((err) => {
        console.error('Error while fetching data', err)
      })
      .finally(() => {
        isFetching.current = false
      })
  }

  function refreshPieChart(activities) {
    const totalErrors =
      activities.filter((record) => record.hasErrors).length || 0
    const totalMigrations = activities.length
    const totalSuccess = totalMigrations - totalErrors
    const successPercentage = Math.round(
      (totalSuccess * 100) / (totalMigrations || 1)
    )
    const failurePercentage = Math.round(
      (totalErrors * 100) / (totalMigrations || 1)
    )

    setFailurePercentage(failurePercentage)
    setSuccessPercentage(successPercentage)
    setTotalMigrations(totalMigrations)
  }

  useEffect(() => {
    fetchActivities()
    const intervalRef = setTimeout(() => {
      if (isFetching.current) {
        return
      }

      fetchActivities()
    }, 1000 * 15)

    return () => {
      clearInterval(intervalRef)
    }
  }, [])

  const formMethods = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: { range: MigrationsCheckTableRange.MONTHLY },
  })
  const { register, watch } = formMethods
  const selectedRange = watch('range')

  const columns = useMemo(() => columnsDataCheck, [columnsDataCheck])

  const tableInstance = useTable(
    {
      columns,
      data: migrationsData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance
  initialState.pageSize = 11

  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100')

  useEffect(() => {
    // TODO: Update data here.
    console.log(selectedRange)
    // setMigrationsData((d) => d)
  }, [selectedRange])

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      shadow="md"
      minH="100%"
      h="50vh"
    >
      <Flex px="25px" justify="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Latest SingleStore Migrations
        </Text>
        <Select
          fontSize="sm"
          variant="subtle"
          defaultValue="monthly"
          width="unset"
          fontWeight="700"
          {...register('range')}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </Flex>
      <Flex flex="1" overflow="auto">
        <Table
          {...getTableProps()}
          variant="simple"
          color="gray.500"
          mb="24px"
          h="full"
        >
          <Thead>
            {headerGroups.map((headerGroup, index: number) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map(
                  (
                    column: ColumnInstance & UseTableColumnProps<{}>,
                    index: number
                  ) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
                    >
                      <Flex
                        justify="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {column.render('Header')}
                      </Flex>
                    </Th>
                  )
                )}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row: Row, index: number) => {
              prepareRow(row)
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index: number) => {
                    let data
                    if (cell.column.Header === 'NAME') {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value[0]}
                        </Text>
                      )
                    } else if (cell.column.Header === 'PROGRESS') {
                      data = (
                        <Flex align="center">
                          <Text
                            me="10px"
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}%
                          </Text>
                        </Flex>
                      )
                    } else if (cell.column.Header === 'STATUS') {
                      data = (
                        <Flex align="center">
                          <Icon
                            w="24px"
                            h="24px"
                            me="5px"
                            color={
                              cell.value === MigrationCheckTableStatus.COMPLETED
                                ? 'green.500'
                                : cell.value === MigrationCheckTableStatus.ERROR
                                ? 'red.500'
                                : cell.value ===
                                  MigrationCheckTableStatus.PROCESSING
                                ? 'orange.500'
                                : null
                            }
                            as={
                              cell.value === MigrationCheckTableStatus.COMPLETED
                                ? MdCheckCircle
                                : cell.value ===
                                  MigrationCheckTableStatus.PROCESSING
                                ? MdPending
                                : cell.value === MigrationCheckTableStatus.ERROR
                                ? MdOutlineError
                                : null
                            }
                          />
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      )
                    } else if (cell.column.Header === 'TABLES') {
                      data = (
                        <Text color="brand.400" fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      )
                    } else if (cell.column.Header === 'DATE') {
                      data = (
                        <Text
                          color={textColor}
                          fontSize="sm"
                          minW="max"
                          fontWeight="700"
                        >
                          {cell.value}
                        </Text>
                      )
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: '14px' }}
                        minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                        borderColor="transparent"
                      >
                        {data}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Flex>
    </Card>
  )
}
