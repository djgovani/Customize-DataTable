const fs = require('fs');
const jsonfile = require('jsonfile')
var path = require('path');

const file = path.join(__dirname, '../database/backup.json');

module.exports = {
  /*
  ----------------------------------------------------------------------
    - postVideos Controller Function
      * Input: id, title and category_id
      * Output: 201 status code on Success, Other Status Code on Fail
  ----------------------------------------------------------------------
  */
  postEmployees(req, res) {
    if (req.body != null) {
      const { name } = req.body;
      const { position } = req.body;
      const { salary } = req.body;
      const { start_date } = req.body;
      const { office } = req.body;
      const { extn } = req.body;

      let obj;
      fs.exists(file, function(exists){
        if(exists){
          fs.readFile(file, (err, data) => {
            if (err) {
              console.log(err);
              return res.status(500).json({err}).end();
            }
            obj = JSON.parse(data);
            let id;
            let notExists = true;
            for (let i=0; i <= obj.employees.length - 1; i++) {
              if (obj.employees[i].extn === extn) {
                return res.status(409).json({message: 'Already exists'}).end();
                notExists = false;
              } else {
                notExists = true;
                id = obj.employees[i].id;
              }
            }

            if (notExists) {
              obj.employees.push({id: (parseInt(id) + 1).toString(), name: name, position: position, salary: `$`+salary, start_date: start_date, office: office, extn: extn});
              json = JSON.stringify(obj);
              fs.writeFile(file, json, 'utf8', (err, response) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({err}).end();
                } else {
                  return res.status(200).json({message: 'Employee added'}).end();
                }
              });
            }
          });
        } else {
          return res.status(404).json({message: 'file not exists'}).end();
        }
      });
    } else {
      return res.status(204).json({message: 'No content'}).end();
    }
  },

  /*
  ----------------------------------------------------------------------
    - updateVideos Controller Function
      * Input: id
      * Output: 200 status code on Success, Other Status Code on Fail
  ----------------------------------------------------------------------
  */
  updateEmployees(req, res) {
    if (req.body != null) {
      const { id } = req.params;
      const { name } = req.body;
      const { position } = req.body;
      const { salary } = req.body;
      const { start_date } = req.body;
      const { office } = req.body;
      const { extn } = req.body;

      let obj;
      fs.exists(file, function(exists){
        if(exists){
          fs.readFile(file, (err, data) => {
            if (err) {
              console.log(err);
              return res.status(500).json({err}).end();
            }
            obj = JSON.parse(data);
            let notExists = true;
            for (let i=0; i <= obj.employees.length - 1; i++) {
              if (obj.employees[i].id === id
                && obj.employees[i].name === name
                && obj.employees[i].position === position
                && obj.employees[i].salary === `$` + salary
                && obj.employees[i].start_date === start_date
                && obj.employees[i].office === office
                && obj.employees[i].extn === extn
                ) {
                return res.status(409).json({message: 'Already exists'}).end();
                notExists = false;
              } else {
                notExists = true;
              }
            }

            if (notExists) {
              let index;
              for (let i=0; i <= obj.employees.length - 1; i++) {
                if (obj.employees[i].id === id) {
                  obj.employees[i].id = id;
                  obj.employees[i].name = name;
                  obj.employees[i].position = position;
                  obj.employees[i].salary = `$` + salary;
                  obj.employees[i].start_date = start_date;
                  obj.employees[i].office = office;
                  obj.employees[i].extn = extn;
                }
              }
              json = JSON.stringify(obj);
              fs.writeFile(file, json, 'utf8', (err, response) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({err}).end();
                } else {
                  return res.status(200).json({message: 'Employee updated'}).end();
                }
              });
            }
          });
        } else {
          return res.status(404).json({message: 'file not exists'}).end();
        }
      });
    } else {
      return res.status(204).json({message: 'No content'}).end();
    }
  },

  /*
  ----------------------------------------------------------------------
    - getVideos Controller Function
      * Output: 200 status code on Success, videos
  ----------------------------------------------------------------------
  */
  getEmployees(req, res) {
    fs.exists(file, function(exists){
      if(exists){
        fs.readFile(file, (err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json({err});
          }
          if (data) {
            console.log(data)
            const parsedData = JSON.parse(data);
            res.status(200).json({
              data: parsedData.employees,
            });
          }
        });
      } else {
        res.status(204).json({message: 'file not exists'});
        console.log("file not exists");
      }
    });
  },

  /*
  ----------------------------------------------------------------------
    - getSingleVideo Controller Function
      * Output: 200 status code on Success, video
  ----------------------------------------------------------------------
  */
  getSingleEmployee(req, res) {
    const { id } = req.params;
    fs.exists(file, function(exists){
      if(exists){
        fs.readFile(file, (err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json({err});
          }
          if (data) {
            const obj = JSON.parse(data);
            let employeesFound = false;
            for (let i=0; i <= obj.employees.length - 1; i++) {
              if (obj.employees[i].id === id) {
                employeesFound = true;
                return res.status(200).json({
                  data: obj.employees[i],
                }).end();
              }
            }
            if (!employeesFound) {
              res.status(404).json({message: 'Not found'}).end();
            }
          }
        });
      } else {
        res.status(204).json({message: 'file not exists'});
        console.log("file not exists");
      }
    });
  },

  /*
  ----------------------------------------------------------------------
    - deleteVideo Controller Function
      * Output: 200 status code on Success
  ----------------------------------------------------------------------
  */
  deleteEmployee(req, res) {
    const { id } = req.params;
    fs.exists(file, function(exists){
      if(exists){
        fs.readFile(file, (err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json({err});
          }
          if (data) {
            const obj = JSON.parse(data);
            let employeeFound = false;
            for (let i=0; i <= obj.employees.length - 1; i++) {
              console.log('params id-->', id);
              if (obj.employees[i].id === id) {
                employeeFound = true;
                if (delete obj.employees.splice(i,1)) {
                  json = JSON.stringify(obj);
                  fs.writeFile(file, json, 'utf8', (err, response) => {
                    if (err) {
                      console.log(err);
                      return res.status(500).json({err}).end();
                    } else {
                      return res.status(200).json({message: 'Employee deleted'}).end();
                    }
                  });
                } else {
                  res.status(400).json({}).end();
                }
              }
            }
            if (!employeeFound) {
              res.status(404).json({message: 'Not found'}).end();
            }
          }
        });
      } else {
        res.status(204).json({message: 'file not exists'});
        console.log("file not exists");
      }
    });
  }
};