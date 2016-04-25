import { createContainer } from 'meteor/react-meteor-data';
import App from '../layouts/App.jsx';

export default createContainer(({ params }) => {
  // const { tabIndex, type, pageNumber } = params;
  const type = params.type || 'default';
  const communityName = params.communityName || 'default';
  const postId = params.postId || '0';

  // if (type) {
  //   console.log(`type : ${type}`);
  // }
  // if (pageNumber) {
  //   console.log(`pageNumber : ${pageNumber}`);
  // }
  const devMode = true;
  
  return {
    type,
    communityName,
    postId,
    devMode,
  };
}, App);
