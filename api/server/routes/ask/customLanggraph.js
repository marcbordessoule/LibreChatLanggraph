const express = require('express');
const AskControllerGraph = require('~/server/controllers/AskControllerGraph');
const { initializeClientGraph } = require('~/server/services/Endpoints/custom');
//const { initializeClientGraph } = require('~/server/services/Endpoints/custom/initializeGraph');
const { addTitle } = require('~/server/services/Endpoints/openAI');
const {
  handleAbort,
  setHeaders,
  validateModel,
  validateEndpoint,
  buildEndpointOption,
} = require('~/server/middleware');

const router = express.Router();

//router.post('/abort', handleAbort());

router.post(
  '/graph',
  validateEndpoint,
  validateModel,
  buildEndpointOption,
  setHeaders,
  async (req, res, next) => {
    await AskControllerGraph(req, res, next, initializeClientGraph, addTitle);
  },
);

module.exports = router;
