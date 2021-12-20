
module.exports = {
  upsert: (model, values, condition) => {
    return model
      .findOne({ where: condition })
      .then(function(obj) {
          // update
          if(obj)
              return obj.update(values);
          // insert
          return model.create(values);
      });
  }
}
