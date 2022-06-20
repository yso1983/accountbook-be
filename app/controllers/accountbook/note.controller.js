const db = require("@db");
const logger = require('@winston');
const { success, failure } = require('@utils').responseJson;
const commFunc =  require('@utils').commFunc;
const { upsert } = require('@utils').sequelizeUtil;
const moment = require('moment-timezone');

const Note = db.note;
const NoteHist = db.noteHist;
const User = db.user;
const Op = db.Sequelize.Op;

function fn_findAllCondition(req){

  let year, month;
  let { dt } = req.query;
  let limit = commFunc.parseFloat(req.query.limit ?? 10);

  if(dt){
    if(dt >= 6){
      year = dt.replace('-', '').substr(0, 4);
      month = parseInt(dt.replace('-', '').substr(4,2));
    }
    else {
      year = new Date().getFullYear();
      month = new Date().getMonth() + 1;
    }
    
    let startDt = moment(new Date(year, (month - 1), 1, 0, 0, 0)).tz('Asia/Seoul').format();
    let endDt = moment(new Date(year, month, 1, 0, 0, 0)).tz('Asia/Seoul').format();

    return {
      where: { 
        group_id: req.groupId,
        created_dt: {
          [Op.between]: [startDt, endDt], 
        },
      }, 
      limit : limit, 
      subQuery:false,
      order: [['id', 'DESC']]
     };
  }else{
    return {
      where: {
        group_id: req.groupId
      },
      limit : limit, 
      subQuery:false,
      order: [['id', 'DESC']]
    };
  }
}

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  Note.findAll(fn_findAllCondition(req))
  .then(result => {
    if (!result) {
      return res.status(404).send({ message: "User Not found." });
    }
    res.status(200).send(success(result));
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};

exports.findDetail = (req, res) => {

  Note.findByPk(req.params.id)
  .then(details => {
    if (!details) {
      return res.status(404).send({ message: "Not found." });
    }
    res.status(200).send(success(details));
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

  let data = req.body;

  if(!data || data.id == undefined){
    logger.error('undefined : id');
    res.status(200).json(failure("9001", "undefined id"));
  }
  else{
    let params = { 
      created_user_id: req.userId, 
      remark: req.body.remark, 
      use_yn: req.body.use_yn, 
      group_id: req.groupId 
    };
    
    upsert(Note, params, { id: req.body.id ?? 0 })
      .then(result => {

        let histParams = {
          note_id: result.id, 
          remark: result.remark, 
          use_yn: result.use_yn,
          created_user_id: result.created_user_id,
          created_dt: result.created_dt
        }

        NoteHist.create(histParams)
        .then(hist => {
         
        })
        .catch(err => {
          logger.error("NoteHist.create ERROR : ",  err.message);
        });

        res.status(200).send(success(result));
      })
      .catch(err => res.status(401).send(failure("9999", err.message)));
  }
};