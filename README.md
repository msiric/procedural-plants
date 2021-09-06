# L-systems Procedural Plant Generation

Project made to play around with L-systems and present the plant generation process visually.

You can generate different plants here: [Demo](https://zealous-morse-eef3b3.netlify.app/)

L-systems (Lindenmayer-systems) allow definition of complex shapes through the use of iteration. 
Initial string of characters is matched against rules which are evaluated repeatedly, and the results are used to generate geometry. 

## Features

All the settings regarding plant generation can be modified and previewed. 
There is a number of different presets that contain distinct axioms and rules.
Colors, length, widths of branches and leaves can be tweaked for visual effect.
Animation of the plant generation can be toggled on/off and the animation speed can be adjusted.

## Implementation

An iterative algorithm is used to go through the production rules and expand each symbol into some larger string of symbols.
To draw and display any changes made to the generation process, a canvas element is used.

## Final note

Even though the number of iterations is limited for the user to prevent browser crashes, increasing this number and tweaking the production rules could lead to very complex and natural-looking organic forms.
The algorithm used in this project can be applied to modeling a variety of organisms and generating self-similar fractals.

## License

MIT
