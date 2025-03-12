import type * as t from './types';
import { EndpointURLs } from './config';
import * as s from './schemas';

export default function createPayload(submission: t.TSubmission) {
  const { conversation, userMessage, endpointOption, isEdited, isContinued, isTemporary } =
    submission;
  const { conversationId } = s.tConvoUpdateSchema.parse(conversation);

  // passer endpointType en var au lieu de const pour pouvoir le modifier si endpoint est langgraph
  var { endpoint, endpointType } = endpointOption as {
    endpoint: s.EModelEndpoint;
    endpointType?: s.EModelEndpoint;
  };
  // Creation de l'url back à appeler en fonction du choix de l'utilisateur dans la liste déroulante des endpoints (type)
  // le endpoint ici correspond au type de endpoint selectionné dans la liste deroulante du front 
  // en cas de endpoint custom, il correspond au nom du endpoint custom name dans librechat.yaml 
  const endpointStr : string = endpoint;
  let server;

  if (endpointStr === 'langgraph') {
    server = "/api/ask/custom/graph"

  } else {
    // construction de l'url back à appeler en fonction du type d'endpoint. 
    server = EndpointURLs[endpointType ?? endpoint];
  }

  if (isEdited && s.isAssistantsEndpoint(endpoint)) {
    server += '/modify';
  } else if (isEdited) {
    server = server.replace('/ask/', '/edit/');
  }

  const payload: t.TPayload = {
    ...userMessage,
    ...endpointOption,
    isContinued: !!(isEdited && isContinued),
    conversationId,
    isTemporary,
  };

  return { server, payload };
}
