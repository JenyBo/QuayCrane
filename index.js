const contentOutputDiv = document.querySelector('.content-output');

function subtractAllContainer(qcsList, start, end, containerCount) {
    for (let i = start; i < end; i++) {
        qcsList[i].containers -= containerCount;
        qcsList[i].containersWorked += containerCount;
    }
}

function getMinContainerValue(qcsList) {
    let minContainer = Number.MAX_SAFE_INTEGER;
    for (let qc of qcsList) {
        minContainer = Math.min(minContainer, qc.containers);
    }
    return minContainer;
}

function getMaxContainerValue(qcsList) {
    let maxContainer = Number.MIN_SAFE_INTEGER;
    for (let qc of qcsList) {
        maxContainer = Math.max(maxContainer, qc.containers);
    }
    return maxContainer;
}

function updateContainers(bayContainers, qcsList, count, transferCapacity, travelTime) {
    for (let qc of qcsList) {
        if (qc.containers === 0) {
            if (qc.index === qcsList.length) {
                qc.containers = bayContainers[qc.index + count];
                subtractAllContainer(qcsList, 0, qc.index - 1, transferCapacity * travelTime);
            }
            if (qc.index === 1) {
                for (let i = 0; i < qcsList.length - 1; i++) {
                    qcsList[i].containers = qcsList[i + 1].containers;
                }
                qcsList[qcsList.length - 1].containers = bayContainers[qcsList.length - 1 + count];
            } else {
                subtractAllContainer(qcsList, 0, qc.index, transferCapacity * travelTime);
                for (let i = qc.index; i < qcsList.length - 1; i++) {
                    qcsList[i].containers = qcsList[i + 1].containers;
                }
                qcsList[qcsList.length - 1].containers = bayContainers[qcsList.length - 1 + count];
            }
        }
    }
}

function quayCraneSolution(bayContainers, numQCs, transferCapacity, travelTime) {
    let qcsList = [];
    for (let i = 0; i < numQCs; ++i) {
        let qc = {
            index: i + 1,
            containers: bayContainers[i],
            containersWorked: 0
        };
        qcsList.push(qc);
    }
    let totalTime = 0;
    let count = 1;
    while (true) {
        let minContainers = getMinContainerValue(qcsList);
        totalTime += 1.0 * minContainers / transferCapacity;
        subtractAllContainer(qcsList, 0, qcsList.length, minContainers);
        updateContainers(bayContainers, qcsList, count, transferCapacity, travelTime);
        count++;
        if (count === bayContainers.length - numQCs + 1) {
            for (let qc of qcsList) {
                qc.containersWorked += qc.containers;
            }
            let value = getMaxContainerValue(qcsList);
            totalTime = totalTime + value / transferCapacity + (count - 1) * travelTime;

            contentOutputDiv.innerHTML = `<p>Tổng thời gian vận chuyển: ${totalTime.toFixed(2)} hours</p>`;

            // Display individual QuayCrane information
            qcsList.forEach((qc) => {
                contentOutputDiv.innerHTML += `<p>QuayCrane ${qc.index} đã vận chuyển được ${qc.containersWorked} containers.</p>`;
            });

            return totalTime;
        }
    }
}

document.getElementById('quayCraneForm').addEventListener('submit', function (event) {
    // Handle the form submission here
    event.preventDefault();

    const bayContainers = [];
    document.querySelectorAll('[id^="inputNumberContainer"]').forEach(function (input) {
        bayContainers.push(parseInt(input.value) || 0);
    });
    const inputTimeValue = document.getElementById('datetimepicker1').value;
    const numQCs = parseInt(document.getElementById('inputNumberQC').value) || 0;
    const transferCapacity = parseInt(document.getElementById('inputProductivity').value) || 0;
    const travelTime = parseFloat(document.getElementById('inputTimeMoveQC').value) || 0;
    const totalTime = quayCraneSolution(bayContainers, numQCs, transferCapacity, travelTime);

    console.log(calculateArrivalTime(inputTimeValue, 9.5))
    contentOutputDiv.innerHTML += `<p>Thời gian hoàn thành: ${calculateArrivalTime(inputTimeValue, 9.5)}</p>`;
    // Update the HTML or perform other actions based on the result
});

function calculateArrivalTime(arrivalTime, totalTime) {
    const arrivalDateTime = new Date(arrivalTime);
    const arrivalTimePlusTotalTime = new Date(arrivalDateTime.getTime() + totalTime * 60 * 60 * 1000);
    return arrivalTimePlusTotalTime.toLocaleString();
}   