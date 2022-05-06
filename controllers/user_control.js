const { User, Thought } = require('../models');

const userControl = {
    getAllUser(req, res) {
        User.find({})
        .select('-__v')
        .sort({_id: -1})
        .then(userData => res.json(userData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'  
        })
        .select('-__v')
        .then(userData => res.json(userData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    addUser({ params, body }, res) {
        console.log(params);
        User.create(body)
            .then(userData => {
                console.log(userData);
                res.json(userData);
            })
            .catch(err => res.json(err));
    },

    addFriend({ params, body }, res) {
        User.findOneAndUpdate(
            {
                _id: params.userId
            },
            {
                $push: {
                    friends : params.friendId
                }
            },
            {
                new: true,
                runValidators: true
            }
            
        )
            .then(friendData => {
                if (!friendData) {
                    res.status(404).json({ message: 'User id not found'});
                    return;
                }
                res.json(friendData);
            })
            .catch(err => res.json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate(
            {
                _id: params.userId
            },
            {
                $set: body
            },
            {
                new: true,
                runValidators: true
            }
        )
        .then(userData => {
            if (!userData){
                res.status(404).json({ message: 'User id not found'});
                return;
            }
            res.json(userData);
        })
        .catch(err => res.json(err));
    },

    removeUser ({ params }, res) {
        User.findOneAndDelete ({
            id: params.userId
        })
            .then(deletedUser => {
                if (!deletedUser) {
                    return res.status(404).json({
                        message: 'User Id Not Found'
                    });
                }
                return Thought.deleteMany({
                    _id: {
                        $in: deletedUser.thoughts
                    }
                })
            })  .then (() =>{
                res.json({ 
                    message:'User and their thoughts have been deleted'
                })
            })
            .catch(err => res.json(err));
    },


    removeFriend({ params }, res) {
        console.log("Now deleting friend")
        User.findOneAndUpdate(
            {
                _id: params.friendId
            },
            {
                $pull: {
                    friends: {
                        _id : params.friendId
                    }
                }
            },
            {
                new: true,
                // runVAlidators: true
            }
        )
            .then(userData => {
                if (!userData) {
                    return res.status(404).json({
                        message: 'User Id Not Found'
                    });
                }
                res.json(userData)
            })
            .catch(err => res.json(err));
    }
};

module.exports = userControl;