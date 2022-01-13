const printArg = (a, ...rest) => {
    let n = rest;
    let content = rest.join(" ");
    console.log(content);
};

printArg("James", "name", "Adeleke", "email", "adeleke@gmail.com");
