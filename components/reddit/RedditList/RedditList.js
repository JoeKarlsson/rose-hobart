import React from 'react';
import PropTypes from 'prop-types';
import RedditItem from '../RedditItem/RedditItem';
import styles from './RedditList.scss';

class RedditList extends React.Component {

  redditItemNodeBuilder(redditDataItem, index) {
    return (
      <RedditItem
        id={redditDataItem.data.id}
        index={index}
        author={redditDataItem.data.author}
        key={redditDataItem.data.id} >
        {redditDataItem.data.title}
      </RedditItem>
    )
  }

  render() {
    const redditListNode = this.props.redditData.map(this.redditItemNodeBuilder);

    return (
      <div className={styles.RedditList}>
        <h2>Reddit List</h2>
        { redditListNode }
      </div>
    )
  }
};

RedditList.propTypes = {
  redditData: PropTypes.array.isRequired,
};

RedditList.defaultProps = {
  redditData: [],
};

export default RedditList;