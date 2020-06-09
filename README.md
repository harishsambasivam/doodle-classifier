# Doodle-Classifier

To run this project, you can simply download the code files from the repository and then download the binary files from the release 0.1. You can also add your own data from Google Quickdraw by choosing the drawings you like. Be aware, though, that you will need to run a script to convert the ".npy" file in a ".bin" file by removing the first 80 header bytes. See the link below for a little tutorial on how:

https://www.youtube.com/watch?v=gX7U6WA7Ffk


Also, since this program imports data from local files, some browsers don't like that at all. Normally, Firefox is supposed to allow it without any problem. Otherwise, for Google Chrome, you need to launch it from a command prompt using the flag below:

--allow-file-access-from-files => "C:\Program Files (x86)\Google\Chrome.exe --allow-file-access-from-files" for example.

Finally, you can basically change any parameter you like in the "model.js" file. You can add layers, modify the number of neurons of each layer, change the optimizer function, etc. 

Have fun!
