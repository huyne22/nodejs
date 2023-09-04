const getHomePage = (req, res) => {
    res.send('hhhhhhhhhhhhhhhhhhhhh')
}
const getHomeDemo = (req, res) => {
    res.render('sample.ejs')
}

module.exports = {
    getHomePage, getHomeDemo
}