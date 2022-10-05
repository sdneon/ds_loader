#ds colors
#define APPLE
#ifdef APPLE
square = (x) -> x * x

console.log '2 squared='.red
console.log square(2)
#endif

sayFortune = (fortune) ->
  console.log fortune

sayFortune 'coffeescript says hi!'
