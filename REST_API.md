Authentication and authorization is done with Cookies. 


# Management on elections

## Create an election

`POST /election/create/`

### Parameters:

- isPermissive, boolean, False, True when the election is not restricted to predefined voters- emails, array of string, List of each voter's mail but might be empty
- ownerMail, string, "", Mail of the owner
- voters, array of string, [], List of each voter's mail
- dateStart, int, -1, Timestamp for election's start
- endStart, int, -1, Timestamp for election's end
- jauges, array of string, [], User-choices of jauges ranking from best to worst
- record, boolean, False, Record votes for research's purpose


### Success Response:

```
HTTP/1.1 200 OK
{
	"data":{
		"type":"election",
		"attributes":{
			"electionId": "fer545,b,8kl784h87zdfs97",
			"ownerToken": "fe78ht485df05fh4f85d4sd;084erg"
		}
	}
}
```

### Error Response:

``` 
HTTP/1.1 400 Bad Request
{
	"status": 400,
	"title": "Must either be permissive or have an owner mail",
	"detail": "Please provide an email address or let the election be permissive."
}
```

``` 
HTTP/1.1 400 Bad Request
{
       "status": 400,
       "title": "Date is not valid",
       "detail": "Please select a future date, or use -1 to desactivate a date."
}
```

```
HTTP/1.1 400 Bad Request 
{
       "status": 400,
       "title": "Voters' list is not valid",
       "detail": "Please add voters' mail when creating a non permissive election."
}
```



## Closing an election

`POST /election/close`


### Parameters:

- electionId, string, mandatory, election identifier


### Success Response:

```
HTTP/1.1 200 OK
{
        "data":{
                "type":"election",
                "attributes":{
                        "electionId": "azdef45h4t5j4y512f1f54gjy5"
                }
        }
}
```

### Error Response:

```
HTTP/1.1 403 Forbidden
{
	"status": 403,
	"title": "You are not allowed."
	"detail": "Please check your authentification credits."
}
```


# Views 

## View results

`GET /election/results/`

### Parameters:

- electionId, string, mandatory, Election's identifier

### Success Response:

```
HTTP/1.1 200 OK
{
        "data":{
                "type":"results",
                "attributes":{ 
			"candidateId1": {
				"jauge1": "0.26", 
				"jauge2": "0.15"
                        }
                }
        }
}
```

### Error Response:

```
HTTP/1.1 400 Bad Request
{
       "status": 400,
       "title": "Unvalid election",
       "detail": "The election does not exist or is not closed."
}
̀```

```
HTTP/1.1 403 Forbidden
{
        "status": 403,
        "title": "You are not allowed."
        "detail": "Please check your authentification credits."
}
```



## View candidate 

`GET /candidate/`

### Parameters:

- candidateId, string, mandatory, Candidate's identifier

### Success Response:

```
HTTP/1.1 200 OK
{
        "data":{
                "type":"candidate",
                "attributes":{
			"name": "John Doe",
			"detail": "Making elections great again"
                }
        }
}
```

### Error Response:

```
HTTP/1.1 400 Bad Request
{
       "status": 400,
       "title": "Unvalid candidate",
       "detail": "The candidate does not exist."
}
```

```
HTTP/1.1 403 Forbidden
{
        "status": 403,
        "title": "You are not allowed."
        "detail": "Please check your authentification credits."
}
```



## View election

`GET /election/details`

### Parameters:

- electionId, string, mandatory, Election's identifier

### Success Response:

```
HTTP/1.1 200 OK
{
        "data":{
                "type":"election",
                "attributes":{
                        "question": "What is your favorite color?",
                        "detail": "Choosing the next color of the year"
			"candidateList": [
				"candidateId1",
				"candidateId2"
			],
			"jaugeList": [
				"Very good",
				"Good"
			]
                }
        }
}
```

### Error Response:

```
HTTP/1.1 400 Bad Request
{
       "status": 400,
       "title": "Unvalid election",
       "detail": "The election does not exist."
}
```

```
HTTP/1.1 403 Forbidden
{
        "status": 403,
        "title": "You are not allowed."
        "detail": "Please check your authentification credits."
}
```



# Accounts

For now, accounts are managed only through tokens and emails. Accounts are deleted as soon as the associated election is closed.
Accounts are thus created with the mail owner attribute. 

No further requests seem needed.
