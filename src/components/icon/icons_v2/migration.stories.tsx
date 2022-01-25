import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../../utils/storybookUtils';

import './migration.stories.scss';

@Component({ name: 'IconMigrationStory' })
class IconMigrationStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper icons-wrapper migration">
        <h3>New icons mapped to corresponding old icons</h3>

        <h6>Actions</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/action-appfunction.svg')} />
              action-appfunction.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/action-appfunction.svg')} width="60" />
              action-appfunction.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/action-appinbox.svg')} />
              action-appinbox.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/action-appinbox.svg')} width="60" />
              action-appinbox.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/action-email.svg')} />
              action-email.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/action-email.svg')} width="60" />
              action-email.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/action-inapp.svg')} />
              action-inapp.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/action-inapp.svg')} width="60" />
              action-inapp.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/action-push.svg')} />
              action-push.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/action-push.svg')} width="60" />
              action-push.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/action-webhook.svg')} />
              action-webhook.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/action-webhook.svg')} width="60" />
              action-webhook.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/actions.svg')} />
              actions.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/device-phone.svg')} width="60" />
              device-phone.svg
            </td>
          </tr>
        </table>

        <h6>Phone</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/phone-blank.svg')} />
              phone-blank.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/phone-exit-campaign.svg')} />
              phone-exit-campaign.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/phone-in-app.svg')} />
              phone-in-app.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/phone-inbox.svg')} />
              phone-inbox.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/phone-push.svg')} />
              phone-push.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/phone-rating.svg')} />
              phone-rating.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/phone-url.svg')} />
              phone-url.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/phone-variables.svg')} />
              phone-variables.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/phone-webhook.svg')} />
              phone-webhook.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
        </table>

        <h6>User Device</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-device-android.svg')} />
              user-device-android.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/device-phone-android.svg')} />
              device-phone-android.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-device-apple.svg')} />
              user-device-apple.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/device-phone-apple.svg')} />
              device-phone-apple.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-device-empty.svg')} />
              user-device-empty.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/device-phone.svg')} />
              device-phone.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-device-unknown.svg')} />
              user-device-unknown.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/device-phone.svg')} />
              device-phone.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-devices-tab.svg')} />
              user-devices-tab.svg
            </td>
            <td>
              <i class="new-icon large" domPropsInnerHTML={require('./new/device-phone.svg')} />
              device-phone.svg
            </td>
          </tr>
        </table>

        <h6>Preview</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/preview-in-browser.svg')} />
              preview-in-browser.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/device-monitor.svg')} />
              device-monitor.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/preview-in-phone.svg')} />
              preview-in-phone.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/device-phone.svg')} />
              device-phone.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/preview-in-tablet.svg')} />
              preview-in-tablet.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/device-tablet.svg')} />
              device-tablet.svg
            </td>
          </tr>
        </table>

        <h6>"x", close, delete and trash</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/close-circle-full.svg')} />
              close-circle-full.svg
            </td>
            <td>
              <i
                class="circle dark bold"
                style="width: 16px; height: 16px;"
                domPropsInnerHTML={require('./new/close-8.svg')}
              />{' '}
              close-8.svg + css background-color + border-radius
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/close.svg')} />
              close.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/close-12.svg')} />
              close-12.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/closeError.svg')} />
              closeError.svg
            </td>
            <td>
              <i
                class="circle error bold"
                style="width: 16px; height: 16px;"
                domPropsInnerHTML={require('./new/close-8.svg')}
              />{' '}
              close-8.svg + css background-color + border-radius
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/closeWarning.svg')} />
              closeWarning.svg
            </td>
            <td>
              <i
                class="circle warning bold"
                style="width: 16px; height: 16px;"
                domPropsInnerHTML={require('./new/close-8.svg')}
              />{' '}
              close-8.svg + css background-color + border-radius
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/trash-small.svg')} />
              trash-small.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/trash.svg')} />
              trash.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/trash.svg')} />
              trash.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/trash.svg')} />
              trash.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/delete.svg')} />
              delete.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/trash.svg')} />
              trash.svg
            </td>
          </tr>
        </table>

        <h6>Status</h6>

        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/error.svg')} />
              error.svg
            </td>
            <td>
              <i
                class="circle error bold"
                style="width: 16px; height: 16px;"
                domPropsInnerHTML={require('./new/exclamation-10.svg')}
              />
              exclamation-10.svg + css background-color + border-radius
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/warning.svg')} /> warning.svg
            </td>
            <td>
              <i
                class="circle warning bold"
                style="width: 16px; height: 16px;"
                domPropsInnerHTML={require('./new/exclamation-10.svg')}
              />
              exclamation-10.svg + css background-color + border-radius
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/info.svg')} /> info.svg
            </td>
            <td>
              <i
                class="circle dark bold"
                style="width: 16px; height: 16px;"
                domPropsInnerHTML={require('./new/help-10.svg')}
              />
              help-10.svg + css background-color + border-radius
            </td>
          </tr>
        </table>

        <h6>check</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/check-circle-full.svg')} />
              check-circle-full.svg
            </td>
            <td>
              <i
                class="circle dark bold"
                style="width: 16px; height: 16px;"
                domPropsInnerHTML={require('./new/check-8.svg')}
              />{' '}
              check-8.svg + css background-color + border-radius
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/check.svg')} />
              check.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/check-12.svg')} width="64" />
              check-12.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/campaign-finished.svg')} />
              campaign-finished.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/check-12.svg')} />
              check-12.svg
            </td>
          </tr>
        </table>

        <h6>Plus</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/add-template.svg')} />
              add-template.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/plus-10.svg')} />
              plus-10.svg
            </td>
          </tr>
        </table>

        <h6>Edit</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/edit-pen.svg')} />
              edit-pen.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/edit.svg')} />
              edit.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/edit.svg')} />
              edit.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/edit.svg')} />
              edit.svg
            </td>
          </tr>
        </table>

        <h6>User</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/audience.svg')} />
              audience.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/users.svg')} />
              users.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-default-avatar.svg')} />
              user-default-avatar.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/user.svg')} />
              user.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user.svg')} />
              user.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/user.svg')} />
              user.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-attributes-empty.svg')} />
              user-attributes-empty.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/user-attributes.svg')} />
              user-attributes.svg
            </td>
          </tr>
        </table>

        <h6>Arrows</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/arrow-right.svg')} />
              arrow-right.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/arrow-right.svg')} />
              arrow-right.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/back.svg')} />
              back.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/chevron-right.svg')} />
              chevron-right.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/caret-down.svg')} />
              caret-down.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/caret-down-12.svg')} />
              caret-down-12.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/caret-right.svg')} />
              caret-right.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/caret-right-12.svg')} />
              caret-right-12.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/chevron-down.svg')} />
              chevron-down.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/chevron-down.svg')} />
              chevron-down.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/chevron-right-thin.svg')} />
              chevron-right-thin.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/chevron-right.svg')} />
              chevron-right.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/chevron-right.svg')} />
              chevron-right.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/chevron-right.svg')} />
              chevron-right.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/download.svg')} />
              download.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/download.svg')} />
              download.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sort-desc.svg')} />
              sort-desc.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/chevron-down.svg')} />
              chevron-down.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sort-down.svg')} />
              sort-down.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/chevron-down.svg')} />
              chevron-down.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sort-up.svg')} />
              sort-up.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/chevron-up.svg')} />
              chevron-up.svg
            </td>
          </tr>
        </table>

        <h6>Sidenav</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sidenav-account.svg')} />
              sidenav-account.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sidenav-analytics.svg')} />
              sidenav-analytics.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sidenav-expand.svg')} />
              sidenav-expand.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sidenav-help-center.svg')} />
              sidenav-help-center.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sidenav-legacy-ab-tests.svg')} />
              sidenav-legacy-ab-tests.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sidenav-legacy-messaging.svg')} />
              sidenav-legacy-messaging.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sidenav-more.svg')} />
              sidenav-more.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sidenav-overview.svg')} />
              sidenav-overview.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sidenav-users.svg')} />
              sidenav-users.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
        </table>

        <h6>Zoom/Search</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/zoom-in.svg')} />
              zoom-in.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/zoom-in.svg')} />
              zoom-in.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/zoom-out.svg')} />
              zoom-out.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/zoom-out.svg')} />
              zoom-out.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/search.svg')} />
              search.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/zoom.svg')} />
              zoom.svg
            </td>
          </tr>
        </table>

        <h6>Other</h6>
        <table>
          <tr>
            <th>Old Icon</th>
            <th>New Icon</th>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/branch-circle.svg')} />
              branch-circle.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/campaign-active.svg')} />
              campaign-active.svg
            </td>
            <td>Use HTML</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/campaign-paused.svg')} />
              campaign-paused.svg
            </td>
            <td>Use HTML</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/campaign-running.svg')} />
              campaign-running.svg
            </td>
            <td>Use HTML</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/circle-thick.svg')} />
              circle-thick.svg
            </td>
            <td>Use HTML</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/circle.svg')} />
              circle.svg
            </td>
            <td>Use HTML</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/cog.svg')} />
              cog.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/settings.svg')} />
              settings.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/collapse.svg')} />
              collapse.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/collapse.svg')} />
              collapse.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/compress.svg')} />
              compress.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/collapse.svg')} />
              collapse.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/copy.svg')} />
              copy.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/copy.svg')} />
              copy.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/details.svg')} />
              details.svg
            </td>
            <td>REMOVE</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/ellipsis-v.svg')} />
              ellipsis-v.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/more-solid.svg')} />
              more-solid.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/expand.svg')} />
              expand.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/expand.svg')} />
              expand.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/eye-small.svg')} />
              eye-small.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/preview.svg')} />
              preview.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/eye.svg')} />
              eye.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/preview.svg')} />
              preview.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/filter-reverse-outline.svg')} />
              filter-reverse-outline.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/filter.svg')} />
              filter.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/filter.svg')} />
              filter.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/filter.svg')} />
              filter.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/folder.svg')} />
              folder.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/folder.svg')} />
              folder.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/grid-icon.svg')} />
              grid-icon.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/table.svg')} />
              table.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/lightning.svg')} />
              lightning.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/lightning.svg')} />
              lightning.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/list-icon.svg')} />
              list-icon.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/list.svg')} />
              list.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/no-template-selected.svg')} />
              no-template-selected.svg
            </td>
            <td>---------- N/A ----------</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/overview.svg')} />
              overview.svg
            </td>
            <td>REMOVE</td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/plus-circle-large.svg')} />
              plus-circle-large.svg
            </td>
            <td>
              <i class="new-icon small circle dark" domPropsInnerHTML={require('./new/plus-10.svg')} /> or{' '}
              <i class="new-icon small" domPropsInnerHTML={require('./new/plus-10.svg')} />
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/plus-circle.svg')} />
              plus-circle.svg
            </td>
            <td>
              <i class="new-icon small circle dark" domPropsInnerHTML={require('./new/plus-10.svg')} /> or{' '}
              <i class="new-icon small" domPropsInnerHTML={require('./new/plus-10.svg')} />
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/save.svg')} />
              save.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/check-12.svg')} />
              check-12.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/send.svg')} />
              send.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/send.svg')} />
              send.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sticky.svg')} />
              sticky.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/magnet.svg')} />
              magnet.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/stopwatch.svg')} />
              stopwatch.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/stopwatch.svg')} />
              stopwatch.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/sync.svg')} />
              sync.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/sync.svg')} />
              sync.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-ab-tests-tab.svg')} />
              user-ab-tests-tab.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/abtest.svg')} />
              abtest.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-attributes-tab.svg')} />
              user-attributes-tab.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/user-details.svg')} />
              user-details.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-milestones-empty.svg')} />
              user-milestones-empty.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/stopwatch.svg')} />
              stopwatch.svg
            </td>
          </tr>
          <tr>
            <td>
              <i domPropsInnerHTML={require('./old/user-milestones-tab.svg')} />
              user-milestones-tab.svg
            </td>
            <td>
              <i class="new-icon" domPropsInnerHTML={require('./new/stopwatch.svg')} />
              stopwatch.svg
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

storiesOf(`${StorybookSection.BASICS}/Icon`, module).add('Migration', () => IconMigrationStory);
