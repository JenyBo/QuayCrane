#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <bits/stdc++.h>

using namespace std;

struct QuayCrane
{
    int index;
    int containers;
    int containersWorked;
};

void subtractAllContainer(vector<QuayCrane> &qcsList, int start, int end, int containerCount)
{
    for (int i = start; i < end; i++)
    {
        qcsList[i].containers -= containerCount;
        qcsList[i].containersWorked += containerCount;
    }
}

int getMinContainerValue(vector<QuayCrane> &qcsList)
{
    int minContainer = numeric_limits<int>::max();

    for (QuayCrane &qc : qcsList)
    {
        minContainer = min(minContainer, qc.containers);
    }
    return minContainer;
}

int getMaxContainerValue(vector<QuayCrane> &qcsList)
{
    int maxContainer = numeric_limits<int>::min();

    for (QuayCrane &qc : qcsList)
    {
        maxContainer = max(maxContainer, qc.containers);
    }
    return maxContainer;
}

void updateContainers(vector<int> &bayContainers, vector<QuayCrane> &qcsList, int count, int transferCapacity, double travelTime)
{
    for (QuayCrane &qc : qcsList)
    {
        if (qc.containers == 0)
        {
            if (qc.index == qcsList.size())
            {
                qc.containers = bayContainers[qc.index + count];
                subtractAllContainer(qcsList, 0, qc.index - 1, transferCapacity * travelTime);
            }
            if (qc.index == 1)
            {
                for (int i = 0; i < qcsList.size() - 1; i++)
                {
                    qcsList[i].containers = qcsList[i + 1].containers;
                }
                qcsList[qcsList.size() - 1].containers = bayContainers[qcsList.size() - 1 + count];
            }
            else
            {
                subtractAllContainer(qcsList, 0, qc.index, transferCapacity * travelTime);
                for (int i = qc.index; i < qcsList.size() - 1; i++)
                {
                    qcsList[i].containers = qcsList[i + 1].containers;
                }
                qcsList[qcsList.size() - 1].containers = bayContainers[qcsList.size() - 1 + count];
            }
        }
    }
}

double quayCraneSolution(vector<int> &bayContainers, int numQCs, int transferCapacity, double travelTime)
{
    vector<QuayCrane> qcsList;
    for (int i = 0; i < numQCs; ++i)
    {
        QuayCrane qc;
        qc.index = i + 1;
        qc.containers = bayContainers[i];
        qc.containersWorked = 0; // Initialize containersWorked to 0
        qcsList.push_back(qc);
    }
    double totalTime = 0;
    int count = 1;
    while (1 == 1)
    {
        int minContainers = getMinContainerValue(qcsList);
        totalTime += 1.0 * minContainers / transferCapacity;
        subtractAllContainer(qcsList, 0, qcsList.size(), minContainers);
        updateContainers(bayContainers, qcsList, count, transferCapacity, travelTime);
        count++;
        if (count == bayContainers.size() - numQCs + 1)
        {
            for (QuayCrane &qc : qcsList)
            {
                qc.containersWorked += qc.containers;
            }
            int value = getMaxContainerValue(qcsList);
            totalTime = totalTime + value / transferCapacity + (count - 1) * travelTime;
            return totalTime;
        }
    }
}

int main()
{
    vector<int> bayContainers = {100, 150, 125};
    int numQCs = 2;
    int transferCapacity = 25;
    double travelTime = 1.0 / 6.0;

    cout << quayCraneSolution(bayContainers, numQCs, transferCapacity, travelTime);
    return 0;
}
