const Exp = require("express");
const app = Exp();
const cors = require("cors");
const disability = require("./routes/disability");
const converter = require("./converter/convertToText")
const search = require("./routes/search")
const package = require("./routes/package")

app.use(Exp.json());
app.use(cors());

app.use(disability);
app.use(converter);
app.use(search);
app.use(package);

app.listen(5000, () => console.log(`Your app listening on port 5000!`));
