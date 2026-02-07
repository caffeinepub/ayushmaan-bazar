import Array "mo:core/Array";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  public type PolicyCategory = {
    #life;
    #health;
    #motor;
    #termPlan;
    #travel;
    #otherGeneral;
  };

  public type Policy = {
    id : Nat;
    name : Text;
    category : PolicyCategory;
    price : Float;
    coverage : Text;
    benefits : Text;
  };

  public type CustomerDetails = {
    name : Text;
    mobile : Text;
    contactTime : Text;
    notes : Text;
  };

  public type Lead = {
    id : Nat;
    policyId : Nat;
    customerDetails : CustomerDetails;
    status : LeadStatus;
    userId : Principal;
    rewardAmount : Float;
  };

  public type LeadStatus = {
    #new;
    #contacted;
    #policyIssued;
  };

  public type Notification = {
    id : Nat;
    message : Text;
    category : PolicyCategory;
  };

  public type PolicyIssuanceConfirmation = {
    policyId : Nat;
    rewardAmount : Float;
  };

  public type UserProfile = {
    name : Text;
    mobile : ?Text;
    referralCode : Text;
    referredBy : ?Text;
  };

  let policies = Map.empty<Nat, Policy>();
  let leads = Map.empty<Nat, Lead>();
  let notifications = Map.empty<Nat, Notification>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextLeadId = 1;
  var nextNotificationId = 1;
  var rewardPercentage : Float = 0.05;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Policy {
    public func compare(policy1 : Policy, policy2 : Policy) : Order.Order {
      Nat.compare(policy1.id, policy2.id);
    };
  };

  module Lead {
    public func compare(lead1 : Lead, lead2 : Lead) : Order.Order {
      Nat.compare(lead1.id, lead2.id);
    };
  };

  module Notification {
    public func compare(notification1 : Notification, notification2 : Notification) : Order.Order {
      Nat.compare(notification1.id, notification2.id);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Policy Management - Public access (no auth required)
  public query ({ caller }) func getPolicy(policyId : Nat) : async Policy {
    switch (policies.get(policyId)) {
      case (null) { Runtime.trap("Policy not found") };
      case (?policy) { policy };
    };
  };

  public query ({ caller }) func getPoliciesByCategory(category : PolicyCategory) : async [Policy] {
    policies.values().filter(func(policy) { policy.category == category }).toArray().sort();
  };

  public query ({ caller }) func comparePolicies(policyIds : [Nat]) : async [Policy] {
    let policiesToCompare = List.empty<Policy>();
    for (policyId in policyIds.values()) {
      switch (policies.get(policyId)) {
        case (?policy) { policiesToCompare.add(policy) };
        case (null) {};
      };
    };
    policiesToCompare.toArray();
  };

  // Lead Management - User access required
  public shared ({ caller }) func submitLead(policyId : Nat, customerDetails : CustomerDetails) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit leads");
    };

    let lead : Lead = {
      id = nextLeadId;
      policyId;
      customerDetails;
      status = #new;
      userId = caller;
      rewardAmount = 0.0;
    };
    leads.add(nextLeadId, lead);
    nextLeadId += 1;
    lead.id;
  };

  public shared ({ caller }) func requestCallback(customerDetails : CustomerDetails) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request callbacks");
    };

    let lead : Lead = {
      id = nextLeadId;
      policyId = 0;
      customerDetails;
      status = #new;
      userId = caller;
      rewardAmount = 0.0;
    };
    leads.add(nextLeadId, lead);
    nextLeadId += 1;
    lead.id;
  };

  // Admin-only: Confirm policy issuance
  public shared ({ caller }) func confirmPolicyIssuance(leadId : Nat) : async PolicyIssuanceConfirmation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can confirm policy issuance");
    };

    switch (leads.get(leadId)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?lead) {
        switch (policies.get(lead.policyId)) {
          case (null) { Runtime.trap("Policy not found") };
          case (?policy) {
            let rewardAmount = policy.price * rewardPercentage;
            let updatedLead = {
              id = lead.id;
              policyId = lead.policyId;
              customerDetails = lead.customerDetails;
              status = #policyIssued;
              userId = lead.userId;
              rewardAmount;
            };
            leads.add(leadId, updatedLead);
            { policyId = lead.policyId; rewardAmount };
          };
        };
      };
    };
  };

  // Rewards - User access required
  public query ({ caller }) func getRewards() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };

    var totalRewards = 0.0;
    for (lead in leads.values()) {
      if (lead.userId == caller) {
        totalRewards += lead.rewardAmount;
      };
    };
    totalRewards;
  };

  // Admin-only: Update reward percentage
  public shared ({ caller }) func updateRewardPercentage(newPercentage : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update reward percentage");
    };
    rewardPercentage := newPercentage;
  };

  // Admin-only: Add notifications
  public shared ({ caller }) func addNotification(message : Text, category : PolicyCategory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add notifications");
    };
    let notification : Notification = {
      id = nextNotificationId;
      message;
      category;
    };
    notifications.add(nextNotificationId, notification);
    nextNotificationId += 1;
  };

  // Notifications - Public access (no auth required)
  public query ({ caller }) func getNotifications() : async [Notification] {
    notifications.values().toArray().sort();
  };

  system func preupgrade() {
    Runtime.trap("This canister does not support pre-upgrade.");
  };

  system func postupgrade() {
    Runtime.trap("This canister does not support post-upgrade.");
  };
};
