import { useRouter } from "next/router";
import { FormEvent, FormEventHandler, useRef } from "react";
import { Todo } from "../../../utils/types";

// define props
interface CreateProps {
  url: string
}

// Define component
function Create(props: CreateProps) {
  // get the next route
  const router = useRouter()

  // only one input, so uncontrolled form will do
  const item = useRef<HTMLInputElement>(null)

  // Function to create new todo
  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    //construct the new todo
    let todo: Todo = { item: "", completed: false }
    if (null !== item.current) {
      todo = { item: item.current.value, completed: false }
    }

    // make api request
    await fetch(props.url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })

    // return to main page
    router.push("/")
  }

  return (
    <div>
      <h1>Create a New Todo</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={item}></input>
        <input type="submit" value="create todo"></input>
      </form>
    </div>
  )
}

//export getStaticProps
export async function getStaticProps(context: any) {
  return {
    props: {
      url: process.env.API_URL,
    },
  }
}

//export component
export default Create
