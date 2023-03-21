import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../../utils/connection";
import { ResponseFuncs } from "../../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
 //capture request method
  {
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

    //function for catching errors
    const catcher = (error: Error) => res.status(400).json({ error })

    //GRAB ID
    const id: string = req.query.id as string

    //Potential Responses for todos/:id
    const handleCase: ResponseFuncs = {
      //GET
      GET: async (req: NextApiRequest, res: NextApiResponse) => {
        const { Todo } = await connect() //connect to database
        res.json(await Todo.findById(id).catch(catcher))
      },

      //PUT
      PUT: async (req: NextApiRequest, res: NextApiResponse) => {
        const { Todo } = await connect() //connect to database
        res.json(await Todo.findByIdAndUpdate(id, req.body, { new: true }).catch(catcher))
      },

      //DELETE
      DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
        const { Todo } = await connect() //connect to database
        res.json(await Todo.findByIdAndRemove(id).catch(catcher))
      },
    }

    //Check if there is a response for the particular method
    const response = handleCase[method]
    if (response) response(req, res)
    else res.status(400).json({ error: "No Response for this Request" })

  }

  export default handler
