const { User, Thought } = require('../models');

const thoughtControl = {
    getAllThought(req, res){
        Thought.find({})
        .select('-__v')
        .sort({ createdAt: -1})
        .then(thoughtData => res.json(thoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    getThoughtById({ params }, res) {
       Thought.findOne({ _id: params.thoughtId })
       .select('-__v')
       .then(thoughtData => res.json(thoughtData))
       .catch(err => {
        console.log(err);
        res.sendStatus(400);
    });
    },
    addThought({ params, body}, res) {
        Thought.create(body)
        .then(thoughtData => {
            User.findOneAndUpdate(
                {
                    _id: params.userId
                },
                {
                    $push: {
                        thoughts: thoughtData._id
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            )
            console.log(thoughtData);
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
    },
    addReaction({ params, body}, res) {
        Thought.findOneAndUpdate(
            {
                _id: params.thoughtId
            },
            {
                $push: {
                    reactions: body
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({message: 'Thought id not found'});
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            {
                _id: params.thoughtId
            },
            {
                $set: body
            },
            {
                new: true,
                runValidators: true
            }
        )
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({message: 'Thought id not found'});
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },
    removeThought({ params }, res) {
        Thought.findOneAndDelete({
            _id: params.thoughtId
        })
            .then(deletedThought => {
                if (!deletedThought){
                    return res.status(404).json({message: 'Thought id not found'});
                }
            })
            .catch(err => res.json(err));
    },
    removeReaction({ params }, res) {
        console.log("Now Removing Reaction")
        Thought.findOneAndUpdate(
            {
                _id: params.thoughtId
            },
            {
                $pull: {
                        reactions: { reactionId: params.reactionId }
                    }
            },
            {
                new: true,
                runVAlidators: true
            }
        )
        .then(thoughtData => {
            if (!thoughtData) {
                return res.status(404).json({
                    message: 'Reaction Id Not Found'
                });
            }
            res.json(thoughtData)
        })
        .catch(err => res.json(err));
}
};
module.exports = thoughtControl;