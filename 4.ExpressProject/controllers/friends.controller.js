const { friends } = require("../models/friends.model");

const getFriends = function (req, res) {
  return res.json(friends);
};

const postFriends = function (req, res) {
  if (!req.body.name) {
    return res.status(400).json({
      error: "Missing friend name",
    });
  }
  const newFriend = {
    name: req.body.name,
    id: friends.length,
  };
  friends.push(newFriend);
  return res.json(newFriend);
};

const getFriend = function (req, res) {
  const id = Number(req.params.id);
  const friend = friends[id];
  if (friend) {
    return res.json(friend);
  } else {
    return res.status(404).json({
      msg: "Friend does not exist",
    });
  }
};

module.exports = {
  getFriends,
  postFriends,
  getFriend,
};
