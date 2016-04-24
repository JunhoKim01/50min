import React from 'react';
import MoreHorizIcon from 'material-ui/lib/svg-icons/navigation/more-horiz';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Styles from 'material-ui/lib/styles';

export default function itemMenu() {
  const iconButtonElement = (
    <IconButton>
        <MoreHorizIcon color={Styles.Colors.grey400} />
      </IconButton>
    );

  const RightIconMenu = (
    <IconMenu
      iconButtonElement={iconButtonElement}
      onItemTouchTap={() => {console.log();}}
    >
      <MenuItem value={'kakao'} primaryText={'카카오톡으로 공유하기'} />
    </IconMenu>
    );

  return RightIconMenu;
}
