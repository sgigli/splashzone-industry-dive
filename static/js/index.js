import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery';
import "../css/news.css";

class Archive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: window.props,
      articles: [],
      selected_topics: [],
      search_text: ""
    };
  }

  fetchSearchResults() {
    const selected_topics_params = this.state.selected_topics.map((topic) => {
      return `topics_${topic.pk}=${topic.id}`
    }).join("&")
    const spacer = selected_topics_params ? "&" : ""
    const text_search_param = `text_search=${this.state.search_text}`

    $.ajax({
      url: "/api/v1/news/?" + selected_topics_params + spacer + text_search_param,
      type: "GET",
      dataType: "json",
      success: (data) => {
        this.setState({ articles: data })
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  onTopicSelection(topic) {
    const topic_index = this.state.selected_topics.indexOf(topic)
    let new_selected_topics
    if (topic_index !== -1){
      new_selected_topics = this.state.selected_topics.filter((t) => t !== topic)
    } else {
      new_selected_topics = this.state.selected_topics.concat(topic)
    }

    this.setState({ selected_topics: new_selected_topics }, () => {
      this.fetchSearchResults()
    })
  }

  onTextSearch(e) {
    this.setState({ search_text: e.target.value}, () => {
      this.fetchSearchResults()
    })
  }

  componentDidMount() {
    this.fetchSearchResults()
  }

  render() {
    const topics = this.state.topics.map((topic, index) => {
      return (
        <li key={index}>
          <input
            type="checkbox"
            name={"topics_" + topic.pk}
            id={"id_topics_" + topic.pk}
            value={topic.id}
            onChange={() => this.onTopicSelection(topic)}
          ></input>
          {topic.display_name}
        </li>
      )
    })

    return (
      <div>
        <form id="archive-filter" method="GET">
          <div className="form-group row">
            <div className="col-sm-2 col-form-label">
              <label htmlFor="topics">Filter by topic:</label>
            </div>
            <div className="col">
              <ul className="form form-multiselect">
                {topics}
              </ul>
            </div>
            <div className="col-sm-1 col-form-label">
              <label htmlFor="text_search">Text:</label>
            </div>
            <div className="col">
              <input type="text" id="id_text_search" name="text_search" className="form-control" onChange={(e) => this.onTextSearch(e)}/>
            </div>
          </div>
        </form>
        {<ResultsHeader selected_topics={this.state.selected_topics} search_text={this.state.search_text}/>}
        <ul className="feed" id="archive">
          {this.state.articles.map((article, index) => {
            return <Article article={article} index={index} key={index}/>
          })}
        </ul>
      </div>
    );
  }
}

function Article({ article, index }) {
  return (
    <li data-newspost-id={article.pk} data-feed-placement={index} key={index}>
      <span className="label label--soft">
        {article.publish_date}
      </span>
        {article.topics.map((topic, index) => {
          return <div className="label label--tag" key={index}>{topic.display_name}</div>
        })}
      <div className="feed-link">
        <a href={article.url}>{ article.title }</a>
      </div>
      <div className="feed-teaser" data-story_id={article.pk}>
        { article.teaser.replace( /(<([^>]+)>)/ig, '') }
        <span>...</span>
      </div>
    </li>
  )
}

function ResultsHeader({ selected_topics, search_text }) {
  if (selected_topics.length || search_text) {
    return (
      <span className="search">
        <div className="row" id="search-result-header">
          <h2>Search Results</h2>
        </div>
        <div className="row search-description">
          { search_text && 
            <div className="col">
              <b>Search term:</b> {search_text}
            </div> }
          { selected_topics && 
            <div className="col">
              <b>Topics:</b>
                { selected_topics.map((topic, index) => {
                    return <div className="label label--tag" key={index}>{topic.display_name}</div>
                  }) }
            </div>
          }
        </div>
      </span>
    )
  } else {
    return (
      <div className="row">
        <h2>News Archive</h2>
      </div>
    )
  }
}

const element = <Archive />;
ReactDOM.render(
  element,
  document.getElementById('react')
);