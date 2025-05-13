<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Service</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($customerServices as $customerService)
            <tr>
                <td>{{ $customerService->customer->user->name }}</td>
                <td>{{ $customerService->service->title }}</td>
                <td>{{ $customerService->status }}</td>
                <td>{{ $customerService->start_date }}</td>
                <td>{{ $customerService->end_date }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
