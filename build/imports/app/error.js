module.exports = (res) => (e) => {
  console.log(e);
  if (typeof e === "object") {
    const code = (e.status && e.code) || 500;
    res.status(code).json(e);
  } else {
    res.status(500).send(e.toString());
  }
};
