# README

## Functions

### POST
`/sportslist/`

#### Input:

```javascript
{
    "avatar" : "http://google.com",
    "username" : "abcdefg",
    "sport": "Basketball",
    "location": "Toronto",
    "rating" : 1000,
    "description" : "Yay",
    "status" : "active"
}
```

#### Response:

```javascript
{
    "id": "12"
    "avatar" : "http://google.com",
    "username" : "abcdefg",
    "sport": "Basketball",
    "location": "Toronto",
    "rating" : 1000,
    "description" : "Yay",
    "status" : "active"
    "date" : "Sat Jun 13 2015 13:55:27 GMT-0400 (Eastern Daylight Time)"
}
```

`/mymatches/:username`

Generates list of matches filtered for the selected user.

### GET
`/sportslist/`

Returns array of matches in JSON format.
