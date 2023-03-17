# iFetch Chrome Extension

The iFetch Chrome Extension is a project that integrates the iFetch conversational agent into the Farfetch store, allowing users to interact with a chatbot while browsing the store's items.

## Installation

To install the extension, follow these steps:

1. Clone the project repository.
1. Open Google Chrome and navigate to the Extensions tab.
1. Select the "Manage Extensions" option, which will open a new tab displaying all installed extensions.
1. Click on the "Load Extension" button, which will open a new window.
1. Select the "Build" folder from the iFetch Chrome Extension project.
1. The extension will be installed and ready to use.

## Usage

To use the iFetch Chrome Extension, follow these steps:

1. Open the page of an item in the [Farfetch store](https://www.farfetch.com/pt/shopping/men/items.aspx).
1. Click on the icon of the iFetch Chrome Extension, which will open a chat window.
1. Interact with the chatbot to ask questions or get more information about the item.

## Editing

If you wish to extend or customize the current version of the project or use it as an interface for your own project, please follow these instructions.

### Change Endpoint

The first step is to change the endpoint used by the project. To do this, you need to modify the `MESSAGES_ENDPOINT` field in both the "App.js" and "Content.js" files. Update the endpoint to the URL of the desired server.

### Send Messages

The messages are sent to the backend with the following JSON format:

```yaml
{
  utterance : string,
  user_id : string, 
  session_id : string,
  user_action : string,
  interface_selected_product_id: string,
  file: image in base64 byte dump
}
```

The `utterance` field contains the message to be sent, the `user_id` field contains the unique identifier for the user, the `session_id` field contains the unique identifier for the session, the `user_action` field contains the action taken by the user, and the `interface_selected_product_id` field contains the identifier of the selected product. After making this changes you have to build the project using `npm` or `yarn`, and running the command `yarn run build`.

The interface expects responses in the following JSON format:

```yaml
{
  has_response : bool,
  recommendations : List<Recommendations>,
  response : string,
  system_action : string
}
```
Where recommendations are presented in the following JSON format:

```yaml
{
  brand : string,
  description : string,
  id : int,
  image_path : string
}
```

Thank you for using the iFetch Chrome Extension! If you have any questions or feedback, please feel free to contact us.
