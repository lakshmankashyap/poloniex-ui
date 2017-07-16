import React, { Component, PropTypes } from 'react';
// import DocumentWidth from './../util/DocumentWidth'

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      left: 0,
      top: 0,
      visibility: 'hidden'
    };
  }
  componentDidMount() {
    let anchor = document.getElementById(this.props.anchorId);
    anchor.addEventListener('mousemove', (e) => this.handleMouseEnter(e));
    anchor.addEventListener('mouseleave', (e) => {
      let className = e.toElement.className;
      if(className != 'NavButton') this.closeMenu();
    });
    let menu = document.getElementById(this.props.id);
    menu.addEventListener('mouseleave', () => this.closeMenu());
  }
  handleMouseEnter(e){
    let menu = document.getElementById(this.props.id);
    let anchor = document.getElementById(this.props.anchorId);

    let anchorRect = anchor.getBoundingClientRect();

    let rectX = anchorRect.left + (anchorRect.width / 2);
    let rectY = anchorRect.top;
    let width = menu.offsetWidth;
    let height = menu.offsetHeight;

    let left = rectX - (width / 2);
    let top = rectY + 40;

    this.setState({
      visibility: 'show',
      showMenu: true,
      left,
      top
    });
  }
  closeMenu(){
    this.setState({
      showMenu: false,
    }, () => {
      setTimeout(() => {
        this.setState({
          visibility: 'hidden'
        });
      }, 1200);
    });
  }
  getMenuStyle() {
    // if (this.state.showMenu) {
    //   if (typeof document != 'undefined') {
    //     let docWidth = DocumentWidth();

    //     let left = this.state.left;
    //     let top = this.state.top;
    //     let width = this.props.width || '';


    //     if (docWidth < 968) {
    //       left = docWidth / 20;
    //       top = 90;
    //       width = '90%';
    //     }

    //     return {
    //       left: left + 'px',
    //       top: top + 'px',
    //       width: width,
    //       opacity: '1',
    //     };
    //   }
    // }

    return {
      opacity: 0,
      top: this.state.top,
      left: this.state.left,
      width: this.props.width,
      visibility: this.state.visibility
    };
  }
  getInsideStyle(){
    return {
      flexDirection: this.props.flexDirection,
    }
  }
  renderMenuItem(item, idx){
    if(this.props.renderMenuItem) {
      return this.props.renderMenuItem(item, idx);
    }

    return (
      <a href={item.href} key={idx} target={item.target}>
      <div className="MenuItem">
          <span>{item.text}</span>
          {renderDesc.call(this, item)}
      </div>
      </a>
    );

    function renderDesc(item){
      if(item.desc) {
        return (
          <p>{item.desc}</p>
        );
      }
    }


  }
  render() { 
      return (
        <div className="Menu" id={this.props.id} style={this.getMenuStyle()}>
          <div className="Arrow"></div>
          <div className="Inside" style={this.getInsideStyle()}>
          {
            this.props.menuItems.map((item, idx) => this.renderMenuItem(item, idx))
          }
          </div>
        </div>
      );
	}
}

Menu.propTypes = {
  id: PropTypes.string.isRequired,
  anchorId: PropTypes.string.isRequired,
  menuItems: PropTypes.array.isRequired,
  renderMenuItem: PropTypes.func
};

Menu.childContextTypes = {
  actions: PropTypes.object
};
