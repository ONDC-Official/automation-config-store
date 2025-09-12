

- **select** : All the following sub conditions must pass as per the api requirement

	- **condition all_item_ids_are_present_in_the_array**: every element of $.message.order.items[*].id must be in $._EXTERNAL.item_ids[*]

- **init** : All the following sub conditions must pass as per the api requirement

	- **condition buyer_finder_fees_needs_to_be_equal**: $.message.order.payments[*].tags[?(@.descriptor.code == 'BUYER_FINDER_FEES')].list[?(@.descriptor.code == 'BUYER_FINDER_FEES_PERCENTAGE')].value must be equal to $._EXTERNAL.buyer_app_fee
	
	- **condition all_item_ids_are_there_which_were_present_in_select**: all of the following sub conditions must be met:
	
	  - **condition all_item_ids_are_there_which_were_present_in_select.1**: every element of $.message.order.items[*].id must be in $._EXTERNAL.selected_item_ids[*]
	  - **condition all_item_ids_are_there_which_were_present_in_select.2**: every element of $._EXTERNAL.selected_item_ids[*] must be in $.message.order.items[*].id

- **confirm** : All the following sub conditions must pass as per the api requirement

	- **condition buyer_finder_fees_needs_to_be_equal**: $.message.order.payments[*].tags[?(@.descriptor.code == 'BUYER_FINDER_FEES')].list[?(@.descriptor.code == 'BUYER_FINDER_FEES_PERCENTAGE')].value must be equal to $._EXTERNAL.buyer_app_fee
	
	- **condition all_item_ids_are_there_which_were_present_in_select**: all of the following sub conditions must be met:
	
	  - **condition all_item_ids_are_there_which_were_present_in_select.1**: every element of $.message.order.items[*].id must be in $._EXTERNAL.selected_item_ids[*]
	  - **condition all_item_ids_are_there_which_were_present_in_select.2**: every element of $._EXTERNAL.selected_item_ids[*] must be in $.message.order.items[*].id

- **status** : All the following sub conditions must pass as per the api requirement

	- **condition order_id_needs_to_be_equal_that_sent_in_on_confirm**: $.message.order_id must be equal to $._EXTERNAL.order_id

- **cancel** : All the following sub conditions must pass as per the api requirement

	- **condition order_id_needs_to_be_equal_that_sent_in_on_confirm**: $.message.order_id must be equal to $._EXTERNAL.order_id