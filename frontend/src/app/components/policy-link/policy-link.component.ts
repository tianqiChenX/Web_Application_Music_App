import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { UPDATE_POLICY } from 'src/app/constants/urls';
import { UPDATE_AUO } from 'src/app/constants/urls';
import { UPDATE_DMCA } from 'src/app/constants/urls';
@Component({
  selector: 'app-policy-link',
  templateUrl: './policy-link.component.html',
  styleUrls: ['./policy-link.component.css'],
})
export class PolicyLinkComponent {
  policy_name = {
    securityPolicy:
      '1.1 All mobile and computing devices that connect to the internal network must comply with the Minimum Access Policy. 1.2 System level and user level passwords must comply with the Password Policy. Providing access to another individual, either deliberately or through failure to secure its access, is prohibited.  ',
    AUPPolicy:
      '2.1 [Music app] proprietary information stored on electronic and computing devices whether owned or leased by [Music app], the employee or a third party, remains the sole property of [Music app].  You must ensure through legal or technical means that proprietary information is protected in accordance with the Data Protection Standard. 2.2 You have a responsibility to promptly report the theft, loss, or unauthorized disclosure of [Music app] proprietary information. 2.3 You may access, use or share [Music app] proprietary information only to the extent it is authorized and necessary to fulfill your assigned job duties. ',
    DMCAPolicy:
      "[Music app] respects the intellectual property rights of others. Per the DMCA, [Music app] will respond expeditiously to claims of copyright infringement on the Site if submitted to [Music app]'s Copyright Agent as described below. Upon receipt of a notice alleging copyright infringement, [Music app] will take whatever action it deems appropriate within its sole discretion, including removal of the allegedly infringing materials and termination of access for repeat infringers of copyright protected content.If you believe this.that your intellectual property rights have been violated by [Music app] or by a third party who has uploaded materials to our website, please provide the following information to the designated Copyright Agent listed below: A description of the copyrighted work or other intellectual property that you claim has been infringed;A description of where the material that you claim is infringing is located on the Site;",
  };

  constructor(private http: HttpClient, public auth: AuthService) {}

  tool_name = {
    request: '',
    notice: '',
    dispute: '',
  };

  securityUpdate(policyText: string) {
    if (policyText) {
      this.policy_name.securityPolicy = policyText;
    }
  }

  AUOUpdate(policyText: string) {
    if (policyText) {
      this.policy_name.AUPPolicy = policyText;
    }
  }
  DMCAUpdate(policyText: string) {
    if (policyText) {
      this.policy_name.DMCAPolicy = policyText;
    }
  }

  updateSecurity(policyText: string) {
    if (policyText) {
      this.policy_name.securityPolicy = policyText;
    }

    let r_body = {
      s_policy: policyText,
    };

    this.http.post(UPDATE_POLICY, r_body).subscribe((res) => {
      console.log(res);
    });
  }

  updateAUO(policyText: string) {
    if (policyText) {
      this.policy_name.AUPPolicy = policyText;
    }

    let r_body = {
      a_policy: policyText,
    };

    this.http.post(UPDATE_AUO, r_body).subscribe((res) => {
      console.log(res);
    });
  }

  updateDMCA(policyText: string) {
    if (policyText) {
      this.policy_name.DMCAPolicy = policyText;
    }

    let r_body = {
      s_policy: policyText,
    };

    this.http.post(UPDATE_DMCA, r_body).subscribe((res) => {
      console.log(res);
    });
  }

  viewRequest() {
    alert('there is no request right now');
  }
  noticeSend(policyText: string) {
    if (policyText) {
      this.tool_name.notice = policyText;
    }
    alert('send successfully');
  }
  disputeClaim() {
    alert('there is no dispute right now');
  }
}
