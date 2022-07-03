# Project Pingo

The idea is that insted of providing all the known spots on google maps, the users starts on a blank page and fills out the map with their own hidden spots. For example "My favorite fishing lake" or "The greatest goat farm ever".

## The problem

One problem was while creating the search function. I got an error sayng "Warning: Each child in a list should have a unique "key" prop and solved it by adding a key prop inside the returned div:

key={suggestion.placeId}
  {...getSuggestionItemProps(suggestion, {
     className,
     style,

## View it live

https://project-pingo.netlify.app/

https://project-pingo.herokuapp.com/

