import { Todo } from "../../../utils/types";
import { useRouter } from "next/router";
import { useState } from "react";

// Define Prop Interface

interface ShowProps {
  todo: Todo
  url: string
}

// Define Component
function Show(props: ShowProps) {
  //get the next router, to make router.push available
  const router = useRouter()

  //set the todo as state
  const [todo, setTodo] = useState<Todo>(props.todo)

  //function to complete a todo
  const handleComplete =async () => {
    if (!todo.completed) {
      // make a copy of todo with completed: true
      const newTodo: Todo = {...todo, completed: true}
      //make api call to update database
      await fetch(props.url + "/" + todo._id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        // send the copy
        body: JSON.stringify(newTodo),
      })
      //update state
      setTodo(newTodo)
    }
  }

  // function to handle clicking delete button
  const handleDelete =async () => {
    await fetch(props.url + "/" + todo._id, {
      method: "delete",
    })
    // send user to main page after delete
    router.push("/")
  }

  return (
    <div>
      <h1>{todo.item}</h1>
      <h2>{todo.completed ? "completed" : "incomplete"}</h2>
      <button onClick={handleComplete}>Complete</button>
      <button onClick={handleDelete}>Delete</button>
      <button
        onClick={ () => {
          router.push("/")
        }}
      >
        Back
      </button>
    </div>
  )
}

// Server Side Props
export async function getServerSideProps(context: any) {
  // fetch the todo
  const res = await fetch(process.env.API_URL + "/" + context.query.id)
  const todo = await res.json()

  //return the serverSideProps the todo and url
  return { props: { todo, url: process.env.API_URL } }
}

export default Show
