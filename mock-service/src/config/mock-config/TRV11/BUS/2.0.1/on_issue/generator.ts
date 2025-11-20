import { Input, SessionData } from "../../../session-types";
import { action, getActionsList, isGrievance } from "../default";

export const onIssueStatusGenerator = async (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  const newDate = existingPayload.context.timestamp;
  existingPayload.message.issue.id =
    sessionData.latest_issue_payload?.id || "ISSUE-1";
  existingPayload.message.issue.created_at =
    sessionData.latest_issue_payload?.created_at || newDate;
  existingPayload.message.issue.updated_at = newDate;
  //   existingPayload.message.issue.expected_response_time = sessionData.latest_issue_payload?.expected_response_time || "PT2H";
  //   existingPayload.message.issue.expected_resolution_time = sessionData.latest_issue_payload?.expected_resolution_time || "P1D";
  existingPayload.message.issue.expected_response_time = sessionData
    .latest_issue_payload?.expected_response_time || { duration: "PT2H" };
  existingPayload.message.issue.expected_resolution_time = sessionData
    .latest_issue_payload?.expected_resolution_time || { duration: "P1D" };
  existingPayload.message.issue.refs =
    sessionData.latest_issue_payload?.refs ||
    existingPayload.message.issue.refs;
  existingPayload.message.issue.actors =
    sessionData.latest_issue_payload?.actors ||
    existingPayload.message.issue.actors;
  existingPayload.message.issue.source_id =
    sessionData.latest_issue_payload?.source_id ||
    existingPayload.message.issue.source_id;
  existingPayload.message.issue.complainant_id =
    sessionData.latest_issue_payload?.complainant_id || "NP1";
  existingPayload.message.issue.descriptor.code =
    sessionData.latest_issue_payload?.descriptor.code || "ITM004";
  existingPayload.message.issue.descriptor.short_desc =
    sessionData.latest_issue_payload?.descriptor.short_desc ||
    "Issue with product quality";
  existingPayload.message.issue.descriptor.long_desc =
    sessionData.latest_issue_payload?.descriptor.long_desc ||
    "Product quality is not correct. facing issues while using the product";
  existingPayload.message.issue.descriptor.additional_desc.url =
    sessionData.latest_issue_payload?.additional_desc?.url ||
    "https://example.com/issue-details";
  existingPayload.message.issue.descriptor.additional_desc.content_type =
    sessionData.latest_issue_payload?.additional_desc?.content_type ||
    "text/html";
  //   existingPayload.message.issue.descriptor.images.url = sessionData.latest_issue_payload?.images.url || "https://example.com/s.jpg";
  existingPayload.message.issue.descriptor.images = sessionData
    .latest_issue_payload?.descriptor?.images || [
    {
      url: "https://example.com/image.jpg",
      size_type: "2MB",
    },
  ];
  // existingPayload.message.issue.descriptor.media.url = sessionData.latest_issue_payload?.descriptor?.media?.url || "https://example.com/media.mp4";

  // Update status and descriptors
  // default status if not overridden
  existingPayload.message.issue.status = sessionData.status || "OPEN";

  switch (sessionData.igm_action) {
    case "on_issue_processing":
      existingPayload.message.issue.status = "PROCESSING";
      existingPayload.message.issue.actors = [
        ...sessionData.latest_issue_payload?.actors,
        {
          id: "NP2",
          type: "COUNTERPARTY_NP",
          info: {
            org: {
              name: `${existingPayload?.context?.bpp_id}::${existingPayload?.context?.domain}`,
            },
            contact: {
              phone: "9999994039",
              email: "sellerapp@interface.com",
            },
            person: {
              name: "Jane Doe",
            },
          },
        },
      ];
      existingPayload.message.issue.descriptor.short_desc =
        "Issue with product quality";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A2",
          descriptor: {
            code: "PROCESSING",
            short_desc: "Complaint created",
          },
          updated_at: "2025-11-04T11:37:59.928Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_processing"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";
      break;

    case "on_issue_processing_1":
    case "on_issue_processing_2":
      existingPayload.message.issue.status = "PROCESSING";
      if (sessionData.igm_action === "on_issue_processing_2" && isGrievance)
        existingPayload.message.issue.level = "GREVIENCE";
      existingPayload.message.issue.actors =
        sessionData.latest_issue_payload?.actors;
      existingPayload.message.issue.descriptor.short_desc =
        "Issue with product quality";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A2",
          descriptor: {
            code: "PROCESSING",
            short_desc: "Complaint created",
          },
          updated_at: "2025-11-04T11:37:59.928Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_processing"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";
      break;

    case "on_issue_need_more_info":
      existingPayload.message.issue.status = "PROCESSING";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A3",
          descriptor: {
            code: "INFO_REQUESTED",
            name: "INFO001",
            short_desc: "Please provide product image",
          },
          updated_at: "2025-11-04T11:38:02.643Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_need_more_info"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";
      // existingPayload.message.issue.last_action_id =
      //   sessionData.last_actions_id[sessionData.last_actions_id - 1]?.id ||
      //   "A3";
      break;

    case "on_issue_provided":
      existingPayload.message.issue.status = "PROCESSING";
      // existingPayload.message.issue.last_action_id =
      //   sessionData.last_actions_id[sessionData.last_actions_id - 1]?.id ||
      //   "A5";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A5",
          descriptor: {
            code: "PROCESSING",
            short_desc: "Complaint created",
          },
          updated_at: "2025-11-04T11:38:06.745Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_provided"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";

      console.log(
        "🚀 ~ onIssueStatusGenerator ~ on_issue_info_provided:",
        JSON.stringify(existingPayload)
      );
      break;

    case "on_issue_resolution":
    case "on_issue_resolution_igm_3":
      existingPayload.message.issue.status = "PROCESSING";
      existingPayload.message.issue.actors = [
        ...sessionData.latest_issue_payload?.actors,
        {
          id: "NP2-GRO",
          type: "COUNTERPARTY_NP_GRO",
          info: {
            org: {
              name: `${existingPayload?.context?.bpp_id}::${existingPayload?.context?.domain}`,
            },
            contact: {
              phone: "9999994039",
              email: "sellerapp@interface.com",
            },
            person: {
              name: "Grievance Officer BNP",
            },
          },
        },
      ];
      // existingPayload.message.issue.last_action_id =
      //   sessionData.last_actions_id[sessionData.last_actions_id - 1]?.id ||
      //   "A6";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A6",
          ref_id: "R_PARENT",
          ref_type: "RESOLUTIONS",
          descriptor: {
            code: "RESOLUTION_PROPOSED",
            short_desc: "Resolution is proposed",
          },
          updated_at: "2025-11-04T11:49:25.358Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_resolution"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";

      const resolutions = existingPayload.message.issue.resolutions;
      resolutions.forEach((r: any) => {
        r.updated_at = newDate;
        if (r.tags) {
          r.tags.forEach((tag: any) => {
            tag.list.forEach((entry: any) => {
              if (entry.descriptor.code === "ITEM") {
                entry.value = sessionData.items[0].id;
              }
              if (entry.descriptor.code === "REFUND_AMOUNT") {
                entry.value = "2260";
              }
            });
          });
        }
        return r;
      });

      if (sessionData.igm_action === "on_issue_resolution_igm_3") {
        existingPayload.message.issue.resolutions = [
          {
            id: "R5",
            descriptor: {
              code: "NO_ACTION",
              short_desc:
                "No further action required for resolving this complaint. ",
            },
            updated_at: existingPayload?.context?.timestamp ?? newDate,
            proposed_by: "NP2",
          },
        ];

        const lastActionsItem = existingPayload.message.issue.resolutions.find(
          (i: any) => i?.descriptor?.code === "NO_ACTION"
        );

        const actionss = existingPayload.message.issue.actions;
        const lastIndex = actionss.length - 1;

        if (lastIndex >= 0) {
          const updatedActorItem = {
            ...actionss[lastIndex],
            ref_id: lastActionsItem?.id ?? "R5",
          };
          actionss[lastIndex] = updatedActorItem;
        }

        existingPayload.message.issue.actions = actionss;
      }
      break;

    case "on_issue_resolution_1":
    case "on_issue_resolution_2":
      existingPayload.message.issue.status = "PROCESSING";
      if (sessionData.igm_action === "on_issue_resolution_2" && isGrievance)
        existingPayload.message.issue.level = "GREVIENCE";
      existingPayload.message.issue.actors =
        sessionData.latest_issue_payload?.actors;
      // existingPayload.message.issue.last_action_id =
      //   sessionData.last_actions_id[sessionData.last_actions_id - 1]?.id ||
      //   "A6";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A6",
          ref_id: "R_PARENT",
          ref_type: "RESOLUTIONS",
          descriptor: {
            code: "RESOLUTION_PROPOSED",
            short_desc: "Resolution is proposed",
          },
          updated_at: "2025-11-04T11:49:25.358Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_resolution"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";

      const resolutionss = existingPayload.message.issue.resolutions;
      resolutionss.forEach((r: any) => {
        r.updated_at = newDate;
        if (r.tags) {
          r.tags.forEach((tag: any) => {
            tag.list.forEach((entry: any) => {
              if (entry.descriptor.code === "ITEM") {
                entry.value = sessionData.items[0].id;
              }
              if (entry.descriptor.code === "REFUND_AMOUNT") {
                entry.value = "2260";
              }
            });
          });
        }
        return r;
      });
      break;

    case "on_issue_resolved":
    case "on_issue_resolved_igm_3":
      const actions = sessionData?.issue_action;
      if (isGrievance) existingPayload.message.issue.level = "GREVIENCE";
      console.log(JSON.stringify(actions));
      const getRefIdData: any = actions.find(
        (i: any) => i.descriptor.code === "RESOLUTION_ACCEPTED"
      );
      console.log(JSON.stringify(getRefIdData));
      existingPayload.message.issue.status = "RESOLVED";
      existingPayload.message.issue.resolutions = sessionData.issue_resolution;
      let sessionActions = sessionData.issue_action;
      const issueActionAccept: any = sessionActions[sessionActions.length - 1];
      const refId = issueActionAccept?.ref_id;
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A8-9",
          ref_id: getRefIdData?.ref_id ?? "A1",
          ref_type: "RESOLUTIONS",
          descriptor: {
            code: "RESOLVED",
            short_desc: "Complaint is Resolved",
          },
          updated_at: newDate,
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_resolved"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";
      if (sessionData.igm_action === "on_issue_resolved_igm_3") {
        existingPayload.message.issue.resolutions =
          sessionData?.issue_resolution ?? "";
      }

      break;

    default:
      // no action
      break;
  }

  let actions = existingPayload.message.issue.actions;
  actions[actions.length - 1].updated_at = newDate;

  const updatedAction = actions[actions.length - 1];
  console.log("sessionData.issue_action", sessionData.issue_action);
  if (sessionData.issue_action.length > 0) {
    console.log("sessionData.issue_action", sessionData.issue_action);
    let sessionDataActions = sessionData.issue_action;
    sessionDataActions.push(updatedAction);
    existingPayload.message.issue.actions = sessionDataActions;
  }

  return existingPayload;
};
