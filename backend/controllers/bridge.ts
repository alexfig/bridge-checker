import { Request, Response } from 'express'

import { getBridgesAlongRoute } from '../services/bridge'

export const search = async (req: Request, res: Response) => {
  try {
    const result = await getBridgesAlongRoute(req.body)
    return res.status(200).send(result)
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: 'Something went wrong' })
  }
}
