# Store Locator API

## Endpoint

    /api/stores

## Params

| Param | Description |
|-------|-------------|
| `lat` | Latitude    |
| `lon` | Longitude   |

## Response

The API will respond with a list of stores that are near the searching point.

```json
[
    {
        "distance": 0.879650883436,
        "store": {
            "name": "Gristedes Supermarket ",
            "address": "686 North Main St. Roosevelt 1st",
            "city": "New York",
            "state": "NY",
            "zipcode": "10044",
            "phone": "(212) 371-2680",
            "lat": 40.712784,
            "lon": -74.005941
        }
    },
    ...redacted...
]
```

The `distance` property is in kilometers and needs to be converted to miles before presenting to user. To convert from kilometers to user-friendly miles the following formula can be used:

```javascript
var humanReadableDistance = Math.round(distance * 0.621371192 * 10) / 10;
```