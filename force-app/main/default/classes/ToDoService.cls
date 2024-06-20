public with sharing class ToDoService {
    @AuraEnabled(cacheable=true)
    public static List<Task> getAllTasks(){
        try {
            Id contextUserId = UserInfo.getUserId();
            List<Task> tasks = [SELECT Id, Subject, Status FROM Task WHERE OwnerId = :contextUserId ORDER BY CreatedDate DESC];
            return tasks;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createTask(String subject){
        try {
            Id contextUserId = UserInfo.getUserId();
            Task task = new Task();
            task.OwnerId = contextUserId;
            task.Subject = subject;
            task.Status = 'Not Started';
            insert task;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void editTask(Id taskId, String subject){
        try {
            Task task = [SELECT Id FROM Task WHERE Id = :taskId];
            task.Subject = subject;
            update task;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void markTaskComplete(Id taskId){
        try {
            Task task = [SELECT Id FROM Task WHERE Id = :taskId];
            task.Status = 'Completed';
            update task;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteTask(Id taskId){
        try {
            Task task = [SELECT Id FROM Task WHERE Id = :taskId];
            delete task;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}