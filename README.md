# Javascript Local File Context Store

Used by the [SmartApp SDK](https://github.com/SmartThingsCommunity/smartapp-sdk-nodejs) to store IDs and access tokens for an installed instance of a SmartApp and retrieves that information for use in asynchronous API calls. The use of a context store is only needed when SmartApps have to call the SmartThings API in response to external events. SmartApps that only response to lifecycle events from the SmartThings platform will automatically have the proper context without the app having to store it.

The context stored by this module consists of the following data elements:

* **installedAppId**: the UUID of the installed app instance. This is the primary key of the table.
* **locationId**: the UUID of the location in which the app is installed
* **authToken**: the access token used in calling the API
* **refreshToken**: the refresh token used in generating a new access token when one expires
* **config**: the current installed app instance configuration, i.e. selected devices, options, etc.

## Installation

```bash
npm install @smartthings/file-context-store
```

## Usage

Create a `FileContextStore` object and pass it to the SmartApp connector to store the context files in
directory on the local machine.

```javascript
smartapp.contextStore(new DynamoDBContextStore())
```

The default storage is in a directory named `data` in the project location. 
To locate the directory elsewhere specify the path to the directory to the 
constructor.

```javascript
smartapp.contextStore(new FileContextStore('/opt/data/smartapp'))
```

## Storage Format

Each installedApp instance context record is stored as a JSON string in a file with the name
`<installedAppId>.json`. For example:
```json
{
  "installedAppId": "b643d57e-e2eb-40e4-b2ef-ff43519941cc",
  "locationId": "8ea7ab21-932d-4256-80c6-abc53932dd3a",
  "authToken": "f4b3b75c-091f-4b31-9833-7b52fe875ffb",
  "refreshToken": "e980829a-9763-4105-b986-2d94114b1e80",
  "clientId": "12475d16-ec68-490a-a708-6d390c112c7c",
  "clientSecret": "2888d8f4-88b6-4741-a98e-54a267e6373b",
  "config": {
    "scenes": [
      {
        "valueType": "STRING",
        "stringConfig": {
          "value": "true"
        }
      }
    ],
    "switches": [
      {
        "valueType": "STRING",
        "stringConfig": {
          "value": "true"
        }
      }
    ],
    "locks": [
      {
        "valueType": "STRING",
        "stringConfig": {
          "value": "true"
        }
      }
    ]
  }
}
```
## Caveats

This data store is intended for development testing use only, not in a production
environment where scalability and redundancy is of primary concern.
