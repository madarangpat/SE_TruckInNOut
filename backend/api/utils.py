def remove_file_from_s3(sender, instance, field_name, **kwargs):
    """Removes the a given file from S3 bucket

    Args:
        sender (model): the model that will be sending
        instance (object): the instance of the model
        field_name (str): the field name of the file
    """

    field = getattr(instance, field_name)
    field.delete(save=False)
