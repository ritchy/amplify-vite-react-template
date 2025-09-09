import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
  
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function getTodoList() {
    // This is an example of a GraphQL query that could be used to fetch todos
   //    query MyQuery {
   // listTodos {
   // items {
   //   id
   //   content
   //   isDone
    // }
    // }
    return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
  }

  async function getTodos() {
    const { data: todos } = await client.models.Todo.list();
    return todos;
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.id)} key={todo.id}>{todo.content} - done -{String(todo.isDone)}-</li>
        ))}
      </ul>
      <div>
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
        Now make front end updates
        </a>
      </div>
      <div>
        {getTodoList()}
        <h2>Current User</h2>
        <p>Sign in details: {user?.signInDetails?.loginId}</p>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
