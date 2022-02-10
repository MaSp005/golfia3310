# Golfia 3310
A little online minigolf type game in the style of the nokia 3310.  
This was made for the Nokia 3310 Game Jam and therefore is not finished or polished at all.

## Controls
Move cursor: WASD / Numpad 8,4,2,6
Shoot: Space / Numpad 5
Reset: R / Numpad 7
Return to menu: Q / Numpad 9

## Level Editor
This is the editor I use to make the levels. It is everything but polished or finished but if you still want to try to create your own courses, here you go: (Its complicated)
* Download the repo to your localhost
* Open the `wallbuild.html`
* Click anywhere to set the startpoint of a wall
* Click again either horizontally of vertically to determine the direction of the wall
* Now define the length of the wall. Be aware: They can only strech from left to right or top to bottom, thus you need to place the top/left end of your wall before the other.
* Use `walls.map(x=>JSON.stringify(x).replace(/\"/g,"")).join(",\n")` in the console (F12) to get the JSON for the walls.
* Open `script.js` in any text editor.
* Use this template in the `levels` definition:

      const levels = [
        {
        // other levels...
        },
        {
            walls: [
                // The JSON you just copied, but put the x/y at the end in quotation marks, like this:
                // I told you this is complicated
                { x: 1, y: 16, l: 82, a: "x" },
                { x: 1, y: 31, l: 82, a: "x" },
                { x: 21, y: 17, l: 8, a: "y" },
                { x: 42, y: 23, l: 8, a: "y" },
                { x: 63, y: 17, l: 8, a: "y" }
            ],
            // where to place your goal
            goal: { x: X, y: Y },
            // where the ball starts
            startpos: [X, Y]
        }
      ]
* Now open Golfia 3310 on localhost and your level should be playable now!