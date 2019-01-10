/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import { get } from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { GlobalState } from 'src/redux/state';
import { reduxConnect, withProps } from '../../../compose';
import { Actions } from '../../../redux';
import { Props, IdentitiesDelView } from './identitiesDelView';
import { identityDelete } from 'src/api/identityApi';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  wallet: state.wallet.wallet,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      delToken: Actions.settings.delToken,
      finishLoading: Actions.loader.finishLoading,
      setWallet: Actions.wallet.setWallet,
      startLoading: Actions.loader.startLoading,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const identity: string = get(props.location, 'state.identity');

    return withProps(
      {
        identity,
        handleCancel: async () => {
          props.history.goBack();
        },
        handleConfirm: async () => {
          await actions.startLoading();

          if (reduxProps.wallet != null) {
            const { wallet } = identityDelete(identity, reduxProps.wallet);
            await actions.setWallet(wallet);
          }
          await actions.finishLoading();

          props.history.push('/identity/change');
        },
        loading: reduxProps.loading,
      },
      (injectedProps) => <Component {...injectedProps} />,
    );
  });

export const IdentitiesDel = enhancer(IdentitiesDelView);
