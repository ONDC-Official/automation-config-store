

- **search** : All the following sub conditions must pass as per the api requirement

	- **condition first_search_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition first_search_request_METRO.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition first_search_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition second_search_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition second_search_request_METRO.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition second_search_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition first_onsearch_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition first_onsearch_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition first_onsearch_request_METRO.1.1**: all of the following sub conditions must be met:
	
	      - **condition first_onsearch_request_METRO.1.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	      - **condition first_onsearch_request_METRO.1.1.2**: $._EXTERNAL.bap_uri must be present in the payload
	    - **condition first_onsearch_request_METRO.1.2**: $._EXTERNAL.city_code must be present in the payload
	  - **condition first_onsearch_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition second_onsearch_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition second_onsearch_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition second_onsearch_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition second_onsearch_request_METRO.1.2**: $._EXTERNAL.start_code must be present in the payload
	  - **condition second_onsearch_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition select_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition select_request_METRO.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition select_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition onselect_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition onselect_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition onselect_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onselect_request_METRO.1.2**: $._EXTERNAL.selected_item_ids[*] must be present in the payload
	  - **condition onselect_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition init_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition init_request_METRO.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition init_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition oninit_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition oninit_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition oninit_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oninit_request_METRO.1.2**: $._EXTERNAL.payments[*].collected_by must be present in the payload
	  - **condition oninit_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition confirm_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition confirm_request_METRO.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition confirm_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition onconfirm_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition onconfirm_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition onconfirm_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onconfirm_request_METRO.1.2**: $._EXTERNAL.updated_payments[*].id must be present in the payload
	  - **condition onconfirm_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition onconfirm_delayed_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition onconfirm_delayed_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition onconfirm_delayed_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onconfirm_delayed_request_METRO.1.2**: $._EXTERNAL.updated_payments[*].id must be present in the payload
	  - **condition onconfirm_delayed_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition status_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition status_request_METRO.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition status_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition onstatus_active_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition onstatus_active_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition onstatus_active_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onstatus_active_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition onstatus_active_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition onstatus_complete_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition onstatus_complete_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition onstatus_complete_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onstatus_complete_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition onstatus_complete_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition onstatus_complete_unsolicited_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition onstatus_complete_unsolicited_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition onstatus_complete_unsolicited_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onstatus_complete_unsolicited_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition onstatus_complete_unsolicited_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition cancel_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition cancel_request_METRO.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition cancel_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition cancel_soft_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition cancel_soft_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition cancel_soft_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	    - **condition cancel_soft_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition cancel_soft_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition cancel_hard_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition cancel_hard_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition cancel_hard_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	    - **condition cancel_hard_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition cancel_hard_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition oncancel_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition oncancel_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition oncancel_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oncancel_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition oncancel_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition oncancel_soft_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition oncancel_soft_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition oncancel_soft_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oncancel_soft_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition oncancel_soft_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition oncancel_hard_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition oncancel_hard_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition oncancel_hard_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oncancel_hard_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition oncancel_hard_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition oncancel_init_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition oncancel_init_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition oncancel_init_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oncancel_init_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition oncancel_init_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition onupdate_request_METRO**: all of the following sub conditions must be met:
	
	  - **condition onupdate_request_METRO.1**: all of the following sub conditions must be met:
	
	    - **condition onupdate_request_METRO.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onupdate_request_METRO.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition onupdate_request_METRO.2**: $._EXTERNAL.usecaseId must be equal to ["METRO"]
	
	- **condition first_search_request**: all of the following sub conditions must be met:
	
	  - **condition first_search_request.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition first_search_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition second_search_request**: all of the following sub conditions must be met:
	
	  - **condition second_search_request.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition second_search_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition first_onsearch_request**: all of the following sub conditions must be met:
	
	  - **condition first_onsearch_request.1**: all of the following sub conditions must be met:
	
	    - **condition first_onsearch_request.1.1**: all of the following sub conditions must be met:
	
	      - **condition first_onsearch_request.1.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	      - **condition first_onsearch_request.1.1.2**: $._EXTERNAL.bap_uri must be present in the payload
	    - **condition first_onsearch_request.1.2**: $._EXTERNAL.city_code must be present in the payload
	  - **condition first_onsearch_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition second_onsearch_request**: all of the following sub conditions must be met:
	
	  - **condition second_onsearch_request.1**: all of the following sub conditions must be met:
	
	    - **condition second_onsearch_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition second_onsearch_request.1.2**: $._EXTERNAL.start_code must be present in the payload
	  - **condition second_onsearch_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition select_request**: all of the following sub conditions must be met:
	
	  - **condition select_request.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition select_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition onselect_request**: all of the following sub conditions must be met:
	
	  - **condition onselect_request.1**: all of the following sub conditions must be met:
	
	    - **condition onselect_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onselect_request.1.2**: $._EXTERNAL.selected_item_ids[*] must be present in the payload
	  - **condition onselect_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition init_request**: all of the following sub conditions must be met:
	
	  - **condition init_request.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition init_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition oninit_request**: all of the following sub conditions must be met:
	
	  - **condition oninit_request.1**: all of the following sub conditions must be met:
	
	    - **condition oninit_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oninit_request.1.2**: $._EXTERNAL.payments[*].collected_by must be present in the payload
	  - **condition oninit_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition confirm_request**: all of the following sub conditions must be met:
	
	  - **condition confirm_request.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition confirm_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition onconfirm_request**: all of the following sub conditions must be met:
	
	  - **condition onconfirm_request.1**: all of the following sub conditions must be met:
	
	    - **condition onconfirm_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onconfirm_request.1.2**: $._EXTERNAL.updated_payments[*].id must be present in the payload
	  - **condition onconfirm_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition onconfirm_delayed_request**: all of the following sub conditions must be met:
	
	  - **condition onconfirm_delayed_request.1**: all of the following sub conditions must be met:
	
	    - **condition onconfirm_delayed_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onconfirm_delayed_request.1.2**: $._EXTERNAL.updated_payments[*].id must be present in the payload
	  - **condition onconfirm_delayed_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition status_request**: all of the following sub conditions must be met:
	
	  - **condition status_request.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition status_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition onstatus_active_request**: all of the following sub conditions must be met:
	
	  - **condition onstatus_active_request.1**: all of the following sub conditions must be met:
	
	    - **condition onstatus_active_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onstatus_active_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition onstatus_active_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition onstatus_complete_request**: all of the following sub conditions must be met:
	
	  - **condition onstatus_complete_request.1**: all of the following sub conditions must be met:
	
	    - **condition onstatus_complete_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onstatus_complete_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition onstatus_complete_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition onstatus_complete_unsolicited_request**: all of the following sub conditions must be met:
	
	  - **condition onstatus_complete_unsolicited_request.1**: all of the following sub conditions must be met:
	
	    - **condition onstatus_complete_unsolicited_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onstatus_complete_unsolicited_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition onstatus_complete_unsolicited_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition cancel_request**: all of the following sub conditions must be met:
	
	  - **condition cancel_request.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	  - **condition cancel_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition cancel_soft_request**: all of the following sub conditions must be met:
	
	  - **condition cancel_soft_request.1**: all of the following sub conditions must be met:
	
	    - **condition cancel_soft_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	    - **condition cancel_soft_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition cancel_soft_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition cancel_hard_request**: all of the following sub conditions must be met:
	
	  - **condition cancel_hard_request.1**: all of the following sub conditions must be met:
	
	    - **condition cancel_hard_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BAP"]
	    - **condition cancel_hard_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition cancel_hard_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition oncancel_request**: all of the following sub conditions must be met:
	
	  - **condition oncancel_request.1**: all of the following sub conditions must be met:
	
	    - **condition oncancel_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oncancel_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition oncancel_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition oncancel_soft_request**: all of the following sub conditions must be met:
	
	  - **condition oncancel_soft_request.1**: all of the following sub conditions must be met:
	
	    - **condition oncancel_soft_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oncancel_soft_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition oncancel_soft_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition oncancel_hard_request**: all of the following sub conditions must be met:
	
	  - **condition oncancel_hard_request.1**: all of the following sub conditions must be met:
	
	    - **condition oncancel_hard_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oncancel_hard_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition oncancel_hard_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition oncancel_init_request**: all of the following sub conditions must be met:
	
	  - **condition oncancel_init_request.1**: all of the following sub conditions must be met:
	
	    - **condition oncancel_init_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition oncancel_init_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition oncancel_init_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition onupdate_request**: all of the following sub conditions must be met:
	
	  - **condition onupdate_request.1**: all of the following sub conditions must be met:
	
	    - **condition onupdate_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition onupdate_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition onupdate_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition status_tech_request**: all of the following sub conditions must be met:
	
	  - **condition status_tech_request.1**: all of the following sub conditions must be met:
	
	    - **condition status_tech_request.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition status_tech_request.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition status_tech_request.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]
	
	- **condition unsolicited_oncancel**: all of the following sub conditions must be met:
	
	  - **condition unsolicited_oncancel.1**: all of the following sub conditions must be met:
	
	    - **condition unsolicited_oncancel.1.1**: $._EXTERNAL.mock_type must be equal to ["BPP"]
	    - **condition unsolicited_oncancel.1.2**: $._EXTERNAL.order_id must be present in the payload
	  - **condition unsolicited_oncancel.2**: $._EXTERNAL.usecaseId must be equal to ["BUS"]