import React from 'react';
import MoreHorizIcon from 'material-ui/lib/svg-icons/navigation/more-horiz';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Styles from 'material-ui/lib/styles';

const iconButtonElement = (
      <IconButton>
          <MoreHorizIcon color={Styles.Colors.grey400} />
        </IconButton>
      );
const kakaoImg = (
      <img src="http://dn.api1.kage.kakao.co.kr/14/dn/btqa9B90G1b/GESkkYjKCwJdYOkLvIBKZ0/o.jpg" />);

const RightIconMenu = (
      <IconMenu
        onChange={(event, value) => {this.sharingItemOnChange(value);}}
        iconButtonElement={iconButtonElement}
        useLayerForClickAway={true}
        // onItemTouchTap={(event, value) => {this.share(value);}}
      >
        <MenuItem
          leftIcon={kakaoImg}
          value={'kakao'}
          primaryText={'카카오톡으로 공유하기'}
        />
      </IconMenu>
      );

export default class ItemShare extends React.Component {
  render() {
    return RightIconMenu;
  }
}
