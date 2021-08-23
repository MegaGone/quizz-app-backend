const validateSpaces = async term => {

    if( term.indexOf(" ") !== -1){
        throw new Error("Please enter a value without spaces")
    } 
    
}

module.exports = {
    validateSpaces
}