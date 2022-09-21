import ForgeUI, { render, Fragment, Text, Form, TextField, TextArea, useEffect, useState, useProductContext } from '@forge/ui';
import api, { route } from "@forge/api";

const App = () => {
  //Stores User's Name
  const[name, setName] = useState(null);

  //Creates Issue in Jira Board
  const addToJiraBoard = async (formData) => {
    let bodyData = {
      fields: {
        summary: formData.summary,
        project: {
          key: "ONBOARD0"
        },
        issuetype: {
          name: "Task"
        },
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  text: formData.desc,
                  type: "text"
                }
              ]
            }
          ]
        }
      }
    };
    const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.json());
  }

  const onSubmit = async (formData) => {
    console.log(formData.desc);
    await addToJiraBoard(formData);
  };

  //Make GraphQL request and set name
  useEffect(async () => {
    const context = useProductContext();
    console.log(String(context.accountId));
    const query = `query  nameQuery { 
                            user(accountId: "` + `${context.accountId}` +`"){
                                name
                                accountId
                              }
                        }`;
    console.log(query);
    let userData = await api.asApp().requestGraph(query);
    let json = await userData.json()
    console.log(json);
    setName(json.data.user.name);

  }, [])
  return (
    <Fragment>
      <Text>Hi {name}!</Text>
      <Form onSubmit={onSubmit}>
        <TextField name="summary" label="Summary" />
        <TextArea name="desc" label="Description" />
      </Form>
    </Fragment>
  );
};

export const run = render(
  <App/>
);
