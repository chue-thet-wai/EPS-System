<table>
    <thead>
        <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($customers as $customer)
            <tr>
                <td>{{ $customer->customer_id }}</td>
                <td>{{ $customer->user->name }}</td>
                <td>{{ $customer->user->email }}</td>
                <td>{{ $customer->phone }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
