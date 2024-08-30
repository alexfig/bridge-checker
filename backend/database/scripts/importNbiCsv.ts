import { open } from 'node:fs/promises'
import { db } from '../index'

const COL_MAPPING = {
  structure_number: 1,
  lat: { cols: [19], fn: degreesToDec },
  long: { cols: [20], fn: (str: string) => degreesToDec(str) * -1 },
  geog: { cols: [19, 20], fn: buildGeographyString },
  feature_description: 10,
  facility_carried: 12,
  location: 13,
  year_built: 26,
  adt: 29,
  year_adt: 30,
  condition: 120,
} as const

const BATCH_SIZE = 50

async function importNbiCsv() {
  const filePath = process.argv[2]

  const file = await open(filePath)
  if (!file) return

  let skip = 1
  let values: ReturnType<typeof parseLine>[] = []
  for await (const line of file.readLines()) {
    if (skip > 0) {
      skip--
      continue
    }

    values.push(parseLine(line))

    if (values.length === BATCH_SIZE) {
      //@ts-expect-error
      await db.insertInto('bridge').values(values).execute()
      values = []
    }
  }

  await db.destroy()
}

function parseLine(line: string) {
  const data = line.split(',')

  return Object.fromEntries(
    Object.entries(COL_MAPPING).map(([key, val]) => {
      if (typeof val === 'number') {
        return [key, data[val]]
      } else {
        //@ts-ignore
        return [key, val.fn(...val.cols.map(c => data[c]))]
      }
    }),
  )
}

function buildGeographyString(latStr: string, longStr: string): string {
  const lat = degreesToDec(latStr)
  const long = degreesToDec(longStr) * -1
  return `SRID=4326;POINT(${long} ${lat})`
}

function degreesToDec(str: string): number {
  const paddedStr = str.padStart(9, '0')
  const deg = parseInt(paddedStr.substring(0, 3))
  const min = parseInt(paddedStr.substring(3, 5)) / 60
  const sec = parseInt(paddedStr.substring(5, 7)) / 3600
  const secDec = parseInt(paddedStr.substring(7, 9)) / 360000

  return deg + min + sec + secDec
}

importNbiCsv()
