

- **search** : All the following sub conditions must pass as per the api requirement

	- **condition first_on_search**: $.message.intent.fulfillment.stops[*].location.descriptor.code must **not** be present in the payload
	
	- **condition second_on_search**: $.message.intent.fulfillment.stops[*].location.descriptor.code must be present in the payload

- **on_search** : All the following sub conditions must pass as per the api requirement

	- **condition second_search**: $.message.catalog.providers[*].items[*].id must **not** be present in the payload
	
	- **condition select**: $.message.catalog.providers[*].items[*].id must be present in the payload

- **select** : All the following sub conditions must pass as per the api requirement

	- **condition on_select**: $.context.transaction_id must be present in the payload

- **on_select** : All the following sub conditions must pass as per the api requirement

	- **condition init**: $.context.transaction_id must be present in the payload

- **init** : All the following sub conditions must pass as per the api requirement

	- **condition on_init**: $.context.transaction_id must be present in the payload

- **on_init** : All the following sub conditions must pass as per the api requirement

	- **condition confirm**: $.context.transaction_id must be present in the payload

- **confirm** : All the following sub conditions must pass as per the api requirement

	- **condition on_confirm**: $.context.transaction_id must be present in the payload

- **on_confirm** : All the following sub conditions must pass as per the api requirement

	- **condition status**: $.context.transaction_id must be present in the payload

- **status** : All the following sub conditions must pass as per the api requirement

	- **condition on_status**: $.context.transaction_id must be present in the payload

- **cancel** : All the following sub conditions must pass as per the api requirement

	- **condition on_cancel**: $.context.transaction_id must be present in the payload

- **on_cancel** : All the following sub conditions must pass as per the api requirement

	- **condition on_update_accepted**: $.context.transaction_id must be present in the payload