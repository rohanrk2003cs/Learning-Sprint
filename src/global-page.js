import ForgeUI, { render, Fragment, Text, Form, TextField, TextArea, useEffect, useState, useProductContext } from '@forge/ui';
import api, { route } from "@forge/api";

const App = () => {
  const[name, setName] = useState(null);
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
  useEffect(async () => {
    const context = useProductContext();
    console.log(context);
    const query = `query { 
                          me { 
                            user(accountId: ${context.accountId}{
                                name
                                accountId 
                              }
                           }
                        }`;
    let userData = await api.asApp().requestGraph(query);
    console.log("lets see userData:")
    userData.json()
          .then( json => {
            console.log(json.data.me.user)
            setName(json["data"]["me"]["user"]["name"]);
          })
  }, [])
  return (
    <Fragment>
      <Text>{name}</Text>
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
