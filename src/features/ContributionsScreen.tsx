import { addProfile, menuIcon, NUMBER_OF_PROFILE_AVATARS, tick } from '@assets';
import { offlineService, userService } from '@covid/Services';
import DaysAgo from '@covid/components/DaysAgo';
import { Loading, LoadingModal } from '@covid/components/Loading';
import { Header } from '@covid/components/Screen';
import { ClippedText, HeaderText, RegularText } from '@covid/components/Text';
import { ApiErrorState, initialErrorState } from '@covid/core/api/ApiServiceErrors';
import i18n from '@covid/locale/i18n';
import { AvatarName, getAvatarByName } from '@covid/utils/avatar';
import { getDaysAgo } from '@covid/utils/datetime';
import merge from '@covid/utils/merge';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import { colors } from '@theme';
import { Accordion, Card, Icon, Text } from 'native-base';
import React, { Component } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, Button } from 'react-native';
import key from 'weak-key';

import Navigator from './Navigation';
import { ScreenParamList } from './ScreenParamList';

type RenderProps = {
  navigation: DrawerNavigationProp<ScreenParamList, 'SelectProfile'>;
  route: RouteProp<ScreenParamList, 'SelectProfile'>;
};

type Patient = {
  id: string;
  name?: string;
  avatar_name?: string;
  reported_by_another?: boolean;
  report_count?: number;
  contribution_for_others_count: number;
  last_reported_at?: Date;
  created_at?: Date;
};

type PatientListState = {
  isLoaded: boolean;
  patients: Patient[];
  shouldRefresh: boolean;
};

type State = PatientListState & ApiErrorState;

const initialState = {
  ...initialErrorState,
  patients: [],
  isLoaded: false,
  shouldRefresh: false,
};

export class ContributionsScreen extends Component<RenderProps, State> {
  constructor(props: RenderProps) {
    super(props);
    this.state = initialState;
  }

  async componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      if (this.state.shouldRefresh) {
        await this.listProfiles();
      }
    });

    await this.listProfiles();
    this.setState({ shouldRefresh: true });
  }

  private retryListProfiles() {
    this.setState({ status: i18n.t('errors.status-retrying'), error: null });
    setTimeout(() => this.listProfiles(), offlineService.getRetryDelay());
  }

  async listProfiles() {
    this.setState({ status: i18n.t('errors.status-loading'), error: null });
    try {
      const patientsResponse = await userService.listPatients();
      const contributionsResponse = await userService.getContributions();

      if (patientsResponse && contributionsResponse) {
        const mergedResponses = merge(patientsResponse.data, contributionsResponse);

        this.setState({
          patients: patientsResponse.data && Object.values(mergedResponses),
          isLoaded: true,
        });
      }
    } catch (error) {
      this.setState({ error });
    }
  }

  async profileSelected(patientId: string, index: number) {
    try {
      const currentPatient = await userService.getCurrentPatient(patientId);
      this.setState({ isApiError: false });
      await Navigator.profileSelected(index === 0, currentPatient);
    } catch (error) {
      this.setState({
        isApiError: true,
        error,
        onRetry: () => {
          this.setState({
            status: i18n.t('errors.status-retrying'),
            error: null,
          });
          setTimeout(() => {
            this.setState({ status: i18n.t('errors.status-loading') });
            this.profileSelected(patientId, index);
          }, offlineService.getRetryDelay());
        },
      });
    }
  }

  getNextAvatarName() {
    if (this.state.patients) {
      const n = (this.state.patients.length + 1) % NUMBER_OF_PROFILE_AVATARS;
      return 'profile' + n.toString();
    } else {
      return 'profile1';
    }
  }

  _renderHeader(item: Patient, expanded: boolean) {
    const avatarImage = getAvatarByName((item?.avatar_name ?? 'profile1') as AvatarName);
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#A9DAD6',
          height: 50,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <Image source={avatarImage} style={styles.avatar} resizeMode="contain" />
          <Text style={{ fontWeight: '600', fontSize: 20 }}> {item.name}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {expanded ? (
            <Icon style={{ fontSize: 18 }} name="remove-circle" />
          ) : (
            <Icon style={{ fontSize: 18 }} name="add-circle" />
          )}
        </View>
      </View>
    );
  }

  _renderContent(item: Patient) {
    const lastReported = item.last_reported_at
      ? getDaysAgo(item.last_reported_at) || i18n.t('today')
      : i18n.t('contributions.not-reported');

    let daysAgoText = '';
    if (typeof lastReported === 'number') {
      daysAgoText = lastReported === 1 ? i18n.t('contributions.day-ago') : i18n.t('contributions.days-ago');
    }

    const reportCount = (item?.report_count ?? 0) + (item?.contribution_for_others_count ?? 0);

    return (
      <Card style={styles.card}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              padding: 10,
              fontStyle: 'italic',
            }}>
            {i18n.t('contributions.count')}
          </Text>
          <Text>{reportCount}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              padding: 10,
              fontStyle: 'italic',
            }}>
            {i18n.t('contributions.last-contribution')}
          </Text>
          <Text>
            {lastReported} {daysAgoText}
          </Text>
        </View>
      </Card>
    );
  }

  render() {
    return (
      <View style={styles.view}>
        <SafeAreaView>
          {this.state.isApiError && (
            <LoadingModal
              error={this.state.error}
              status={this.state.status}
              onRetry={this.state.onRetry}
              onPress={() => this.setState({ isApiError: false })}
            />
          )}
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.rootContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.toggleDrawer();
                }}>
                <Image source={menuIcon} style={styles.menuIcon} />
              </TouchableOpacity>

              <Header>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <Icon
                    name="chevron-thin-left"
                    type="Entypo"
                    style={styles.icon}
                    onPress={() => this.props.navigation.goBack()}
                  />
                  <HeaderText style={{ marginBottom: 12 }}>{i18n.t('my-contributions')}</HeaderText>
                </View>
              </Header>

              {this.state.isLoaded ? (
                <View>
                  <Accordion
                    dataArray={this.state.patients}
                    expanded={0}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                  />
                </View>
              ) : (
                <Loading
                  status={this.state.status}
                  error={this.state.error}
                  style={{ borderColor: 'green', borderWidth: 1 }}
                  onRetry={() => this.retryListProfiles()}
                />
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profileList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '100%',
    alignContent: 'stretch',
  },

  cardContainer: {
    width: '45%',
    margin: 5,
  },

  avatarContainer: {
    alignItems: 'center',
    width: 100,
    marginBottom: 10,
  },

  avatar: {
    height: 30,
    marginRight: 10,
    width: 30,
  },

  tick: {
    height: 30,
    width: 30,
  },

  circle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    top: 0,
    right: -5,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'white',
  },

  addImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },

  card: {
    width: '100%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: 0,
    paddingVertical: 20,
    paddingHorizontal: 12,
  },

  view: {
    backgroundColor: colors.backgroundSecondary,
  },

  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'space-between',
  },

  content: {
    justifyContent: 'space-between',
    marginVertical: 32,
    marginHorizontal: 18,
  },

  rootContainer: {
    padding: 10,
  },

  shareContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  menuIcon: {
    height: 20,
    width: 20,
    tintColor: colors.primary,
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 10,
  },

  icon: {
    fontSize: 16,
    color: colors.secondary,
    marginTop: -10,
    marginRight: 10,
  },
});
